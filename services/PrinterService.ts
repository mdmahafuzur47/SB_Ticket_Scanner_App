import { PermissionsAndroid, Platform } from 'react-native';
import BluetoothPrinter from '@vardrz/react-native-bluetooth-escpos-printer';

const BluetoothManager = BluetoothPrinter.BluetoothManager as any;
const BluetoothEscposPrinter = BluetoothPrinter.BluetoothEscposPrinter as any;

class PrinterService {
  private connectedDevice: any = null;
  private connectionListeners: Array<(device: any) => void> = [];

  // Check if printer is already connected
  isConnected(): boolean {
    return this.connectedDevice !== null;
  }

  // Get connected device
  getConnectedDevice(): any {
    return this.connectedDevice;
  }

  // Request Bluetooth permissions
  async requestBluetoothPermissions(): Promise<boolean> {
    if (Platform.OS === 'android') {
      try {
        const apiLevel = Platform.Version;

        if (apiLevel >= 31) {
          const granted = await PermissionsAndroid.requestMultiple([
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          ]);

          return (
            granted['android.permission.BLUETOOTH_CONNECT'] ===
              PermissionsAndroid.RESULTS.GRANTED &&
            granted['android.permission.BLUETOOTH_SCAN'] ===
              PermissionsAndroid.RESULTS.GRANTED
          );
        } else {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          );
          return granted === PermissionsAndroid.RESULTS.GRANTED;
        }
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  }

  // Get paired devices
  async getPairedDevices(): Promise<any[]> {
    try {
      const enabled = await BluetoothManager.isBluetoothEnabled();
      if (!enabled) {
        await BluetoothManager.enableBluetooth();
      }

      const devices = await BluetoothManager.scanDevices();
      const pairedDevicesArray = JSON.parse(devices);
      return pairedDevicesArray.paired || [];
    } catch (error) {
      console.error('Get devices error:', error);
      throw error;
    }
  }

  // Connect to printer
  async connectToPrinter(device?: any): Promise<any> {
    try {
      // If already connected, return the connected device
      if (this.connectedDevice) {
        console.log('Already connected to:', this.connectedDevice.name);
        return this.connectedDevice;
      }

      const hasPermission = await this.requestBluetoothPermissions();
      if (!hasPermission) {
        throw new Error('Bluetooth permissions not granted');
      }

      const enabled = await BluetoothManager.isBluetoothEnabled();
      if (!enabled) {
        await BluetoothManager.enableBluetooth();
      }

      // If no device provided, find one
      if (!device) {
        const devices = await this.getPairedDevices();

        if (devices.length === 0) {
          throw new Error('No paired devices found');
        }

        // Try to find XP-P210
        device =
          devices.find((d: any) => d.name?.toLowerCase().includes('p210')) ||
          devices[0];
      }

      // Connect to the device
      await BluetoothManager.connect(device.address);
      await BluetoothEscposPrinter.printerInit();

      this.connectedDevice = device;
      this.notifyListeners(device);

      console.log('Connected to printer:', device.name);
      return device;
    } catch (error) {
      console.error('Connection error:', error);
      throw error;
    }
  }

  // Disconnect from printer
  async disconnectFromPrinter(): Promise<void> {
    try {
      if (this.connectedDevice) {
        await BluetoothManager.disconnect();
        this.connectedDevice = null;
        this.notifyListeners(null);
        console.log('Disconnected from printer');
      }
    } catch (error) {
      console.error('Disconnect error:', error);
      throw error;
    }
  }

  // Print text using the connected printer
  async printText(text: string, options: any = {}): Promise<void> {
    if (!this.connectedDevice) {
      throw new Error('No printer connected');
    }

    try {
      await BluetoothEscposPrinter.printText(text, options);
    } catch (error) {
      console.error('Print error:', error);
      throw error;
    }
  }

  // Initialize printer
  async initPrinter(): Promise<void> {
    if (!this.connectedDevice) {
      throw new Error('No printer connected');
    }

    try {
      await BluetoothEscposPrinter.printerInit();
    } catch (error) {
      console.error('Init error:', error);
      throw error;
    }
  }

  // Add connection listener
  addConnectionListener(listener: (device: any) => void): void {
    this.connectionListeners.push(listener);
  }

  // Remove connection listener
  removeConnectionListener(listener: (device: any) => void): void {
    this.connectionListeners = this.connectionListeners.filter(
      l => l !== listener,
    );
  }

  // Notify all listeners
  private notifyListeners(device: any): void {
    this.connectionListeners.forEach(listener => listener(device));
  }
}

// Export singleton instance
export default new PrinterService();
