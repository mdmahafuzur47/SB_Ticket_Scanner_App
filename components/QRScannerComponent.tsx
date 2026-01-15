import {View, Text, StyleSheet, Alert, TouchableOpacity} from 'react-native';
import React, {useState, useEffect} from 'react';
import {RNCamera} from 'react-native-camera';
import {useFocusEffect} from '@react-navigation/native';

const QRScannerComponent = () => {
  const [scannedData, setScannedData] = useState<string>('');
  const [scanning, setScanning] = useState(true);
  const [isFocused, setIsFocused] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      // Delay camera mounting to ensure UIManager is ready
      const timer = setTimeout(() => {
        setIsFocused(true);
      }, 100);

      return () => {
        clearTimeout(timer);
        setIsFocused(false);
        setCameraReady(false);
      };
    }, []),
  );

  const onCameraReady = () => {
    setCameraReady(true);
  };

  const onBarCodeRead = (scanResult: any) => {
    if (scanning && scanResult.data && cameraReady) {
      setScanning(false);
      const data = scanResult.data;
      console.log('QR Code Scanned:', data);
      console.log('Scan Type:', scanResult.type);
      console.log('Full scan info:', scanResult);
      setScannedData(data);
      Alert.alert('QR Code Scanned', data, [
        {
          text: 'OK',
          onPress: () => setScanning(true),
        },
      ]);
    }
  };

  const clearData = () => {
    setScannedData('');
    setScanning(true);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>QR Code Scanner</Text>
        <Text style={styles.subtitle}>Point camera at QR code</Text>
      </View>

      <View style={styles.cameraContainer}>
        {isFocused ? (
          <RNCamera
            style={styles.camera}
            onBarCodeRead={onBarCodeRead}
            onCameraReady={onCameraReady}
            barCodeTypes={[RNCamera.Constants.BarCodeType.qr]}
            captureAudio={false}
            notAuthorizedView={
              <View style={styles.centerText}>
                <Text style={styles.errorText}>Camera permission denied</Text>
              </View>
            }
            pendingAuthorizationView={
              <View style={styles.centerText}>
                <Text style={styles.errorText}>Requesting camera permission...</Text>
              </View>
            }
            androidCameraPermissionOptions={{
              title: 'Permission to use camera',
              message: 'We need your permission to scan QR codes',
              buttonPositive: 'Ok',
              buttonNegative: 'Cancel',
            }}>
            <View style={styles.overlay}>
              <View style={styles.scanArea}>
                <Text style={styles.scanText}>
                  {!cameraReady
                    ? 'Initializing...'
                    : scanning
                    ? 'Scan QR Code'
                    : 'Processing...'}
                </Text>
              </View>
            </View>
          </RNCamera>
        ) : (
          <View style={styles.camera}>
            <View style={styles.overlay}>
              <Text style={styles.scanText}>Camera Loading...</Text>
            </View>
          </View>
        )}
      </View>

      {scannedData ? (
        <View style={styles.resultContainer}>
          <Text style={styles.resultLabel}>Last Scanned:</Text>
          <Text style={styles.resultText}>{scannedData}</Text>
          <TouchableOpacity style={styles.clearButton} onPress={clearData}>
            <Text style={styles.clearButtonText}>Clear & Scan Again</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.resultContainer}>
          <Text style={styles.instructionText}>
            Scan a QR code to see results
          </Text>
        </View>
      )}
    </View>
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
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 14,
    color: '#fff',
    marginTop: 5,
  },
  cameraContainer: {
    flex: 1,
    margin: 20,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  scanArea: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: '#00FF00',
    borderRadius: 10,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  centerText: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#fff',
    fontSize: 16,
  },
  resultContainer: {
    backgroundColor: '#fff',
    padding: 20,
    margin: 20,
    marginTop: 0,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  resultLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  resultText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
  instructionText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  clearButton: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  clearButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default QRScannerComponent;
