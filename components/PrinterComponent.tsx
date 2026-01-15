import {
  View,
  Text,
  Alert,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ScrollView,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import BluetoothPrinter from '@vardrz/react-native-bluetooth-escpos-printer';

const BluetoothManager = BluetoothPrinter.BluetoothManager as any;
const BluetoothEscposPrinter = BluetoothPrinter.BluetoothEscposPrinter as any;

const PrinterComponent = () => {
  const [pairedDevices, setPairedDevices] = useState<any[]>([]);
  const [connectedDevice, setConnectedDevice] = useState<any>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  // Get paired devices
  useEffect(() => {
    requestBluetoothPermissions();
  }, []);

  const requestBluetoothPermissions = async () => {
    if (Platform.OS === 'android') {
      try {
        const apiLevel = Platform.Version;

        if (apiLevel >= 31) {
          // Android 12+ requires these permissions
          const granted = await PermissionsAndroid.requestMultiple([
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          ]);

          if (
            granted['android.permission.BLUETOOTH_CONNECT'] ===
              PermissionsAndroid.RESULTS.GRANTED &&
            granted['android.permission.BLUETOOTH_SCAN'] ===
              PermissionsAndroid.RESULTS.GRANTED
          ) {
            getPairedDevices();
          } else {
            Alert.alert(
              'Permissions Required',
              'Bluetooth permissions are required to connect to the printer. Please grant permissions in Settings.',
            );
          }
        } else {
          // Android 11 and below
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          );

          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            getPairedDevices();
          } else {
            Alert.alert(
              'Permission Required',
              'Location permission is required for Bluetooth functionality.',
            );
          }
        }
      } catch (err) {
        console.warn(err);
        Alert.alert('Error', 'Failed to request permissions');
      }
    } else {
      getPairedDevices();
    }
  };

  const getPairedDevices = async () => {
    try {
      const enabled = await BluetoothManager.isBluetoothEnabled();
      if (!enabled) {
        const devices = await BluetoothManager.enableBluetooth();
        setPairedDevices(devices || []);
      } else {
        // Scan for devices
        const devices = await BluetoothManager.scanDevices();
        const pairedDevicesArray = JSON.parse(devices);
        setPairedDevices(pairedDevicesArray.paired || []);
      }
    } catch (error) {
      console.error('Bluetooth error:', error);
      Alert.alert(
        'Error',
        'Failed to get paired devices. Please make sure:\n' +
          '1. Bluetooth is turned on\n' +
          '2. Your printer is paired in Bluetooth settings\n' +
          '3. Permissions are granted\n\n' +
          `Error: ${error}`,
      );
    }
  };

  const connectToDevice = async (device: any) => {
    setIsConnecting(true);
    try {
      await BluetoothManager.connect(device.address);
      setConnectedDevice(device);

      // Verify connection by checking if device is connected
      const isConnected = await BluetoothManager.isBluetoothEnabled();
      if (isConnected) {
        // Initialize printer
        await BluetoothEscposPrinter.printerInit();
        Alert.alert('Success', `Connected to ${device.name || device.address}`);
      }
    } catch (error) {
      console.error('Connection error:', error);
      Alert.alert(
        'Error',
        `Failed to connect to ${device.name || device.address}\n${error}`,
      );
      setConnectedDevice(null);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectDevice = async () => {
    try {
      await BluetoothManager.disconnect();
      setConnectedDevice(null);
      Alert.alert('Disconnected', 'Printer disconnected');
    } catch (error) {
      Alert.alert('Error', 'Failed to disconnect');
    }
  };

  const printTestReceipt = async () => {
    if (!connectedDevice) {
      Alert.alert('Error', 'Please connect to a printer first');
      return;
    }

    try {
      // Simple direct print test
      await BluetoothEscposPrinter.printerInit();
      // Send raw ESC/POS commands
      const ESC = '\x1B';
      const text =
        ESC +
        '@' + // Initialize printer
        'TEST RECEIPT\n' +
        '================================\n' +
        'Date: ' +
        new Date().toLocaleString() +
        '\n' +
        '--------------------------------\n' +
        'Item              Qty    Price\n' +
        '--------------------------------\n' +
        'Test Item 1        2    $10.00\n' +
        'Test Item 2        1     $5.00\n' +
        '--------------------------------\n' +
        'TOTAL:                  $15.00\n' +
        '================================\n' +
        'Thank you!\n\n\n\n';

      await BluetoothEscposPrinter.printText(text, {});

      Alert.alert('Success', 'Receipt sent! Check your printer.');
    } catch (error) {
      console.error('Print error:', error);
      Alert.alert('Print Error', `${error}`);
    }
  };

  const renderDevice = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={[
        styles.deviceItem,
        connectedDevice?.address === item.address && styles.connectedDevice,
      ]}
      onPress={() => connectToDevice(item)}
      disabled={isConnecting || connectedDevice?.address === item.address}
    >
      <Text style={styles.deviceName}>{item.name || 'Unknown Device'}</Text>
      <Text style={styles.deviceAddress}>{item.address}</Text>
      {connectedDevice?.address === item.address && (
        <Text style={styles.connectedText}>Connected</Text>
      )}
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>XP-P210 Printer</Text>
        <TouchableOpacity
          style={styles.refreshButton}
          onPress={requestBluetoothPermissions}
        >
          <Text style={styles.refreshButtonText}>Refresh Devices</Text>
        </TouchableOpacity>
      </View>

      {connectedDevice && (
        <View style={styles.connectedSection}>
          <Text style={styles.sectionTitle}>Connected Device</Text>
          <View style={styles.connectedInfo}>
            <Text style={styles.deviceName}>{connectedDevice.name}</Text>
            <TouchableOpacity
              style={styles.disconnectButton}
              onPress={disconnectDevice}
            >
              <Text style={styles.buttonText}>Disconnect</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.printButton}
            onPress={printTestReceipt}
          >
            <Text style={[styles.buttonText, { color: '#2196F3' }]}>
              Print Test Receipt
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Paired Devices</Text>
        {pairedDevices.length === 0 ? (
          <Text style={styles.emptyText}>
            No paired devices found. Please pair your XP-P210 printer in
            Bluetooth settings first.
          </Text>
        ) : (
          <FlatList
            data={pairedDevices}
            keyExtractor={item => item.address}
            renderItem={renderDevice}
            scrollEnabled={false}
          />
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#2196F3',
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  refreshButton: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  refreshButtonText: {
    color: '#2196F3',
    fontWeight: '600',
  },
  section: {
    backgroundColor: '#fff',
    margin: 15,
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  connectedSection: {
    backgroundColor: '#4CAF50',
    margin: 15,
    padding: 15,
    borderRadius: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  connectedInfo: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  deviceItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    borderRadius: 5,
    marginBottom: 5,
    backgroundColor: '#f9f9f9',
  },
  connectedDevice: {
    backgroundColor: '#e8f5e9',
    borderColor: '#4CAF50',
    borderWidth: 2,
  },
  deviceName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  deviceAddress: {
    fontSize: 14,
    color: '#666',
  },
  connectedText: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: 'bold',
    marginTop: 5,
  },
  emptyText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    padding: 20,
  },
  disconnectButton: {
    backgroundColor: '#f44336',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  printButton: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default PrinterComponent;
