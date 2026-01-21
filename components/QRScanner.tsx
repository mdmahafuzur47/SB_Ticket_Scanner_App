import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import React, { useState } from 'react';
import { Camera, CameraType } from 'react-native-camera-kit';
import axios from 'axios';
import ApplicationDetails from './ApplicationDetails';

// const APIURL =
// 'https://admin.skillbridgebd.com/api/frontend/v1/application-barcode';
const APIURL =
  'http://192.168.100.208:8000/api/frontend/v1/application-barcode';

const QRScanner = () => {
  const [scanning, setScanning] = useState(false);
  const [scannedData, setScannedData] = useState('');
  const [loading, setLoading] = useState(false);
  const [applicationData, setApplicationData] = useState<any>(null);
  const [showDetails, setShowDetails] = useState(false);

  const fetchData = async (qrData: string) => {
    try {
      setLoading(true);
      const res = await axios.get(`${APIURL}/${qrData}`);
      console.log('Fetched Data:', res?.data?.data);

      if (res?.data?.data) {
        setApplicationData(res.data.data);
        setScannedData(qrData);
        setShowDetails(true);
      } else {
        Alert.alert('No Data', 'No application data found for this QR code.');
      }
    } catch (error: any) {
      console.error('Error fetching data:', error);
      Alert.alert(
        'Error',
        error.response?.data?.message ||
          'Failed to fetch application data. Please try again.',
      );
    } finally {
      setLoading(false);
    }
  };

  const onReadCode = async (event: any) => {
    if (!scanning || loading) return;

    const data = event.nativeEvent.codeStringValue;
    console.log('QR Code Scanned:', data);

    await fetchData(data);
    setScanning(false);
  };

  const startScanning = () => {
    setScanning(true);
    setShowDetails(false);
  };

  const closeScanner = () => {
    setScanning(false);
  };

  const closeDetails = () => {
    setShowDetails(false);
    setApplicationData(null);
  };

  if (showDetails && applicationData) {
    return (
      <ApplicationDetails
        data={applicationData}
        onClose={closeDetails}
        onRefetch={fetchData}
        scannedData={scannedData}
      />
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>QR Scanner For Job</Text>
        <Text style={styles.subtitle}>Click button to scan QR code</Text>
      </View>

      {!scanning ? (
        <View style={styles.content}>
          <TouchableOpacity style={styles.scanButton} onPress={startScanning}>
            <Text style={styles.scanButtonText}>Open Camera & Scan</Text>
          </TouchableOpacity>

          {scannedData ? null : (
            <Text style={styles.instructionText}>No QR code scanned yet</Text>
          )}
        </View>
      ) : (
        <View style={styles.scannerContainer}>
          {loading && (
            <View style={styles.loadingOverlay}>
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#2196F3" />
                <Text style={styles.loadingText}>
                  Fetching application data...
                </Text>
              </View>
            </View>
          )}

          <View style={styles.topContent}>
            <Text style={styles.scannerTitle}>Scan QR Code</Text>
            <Text style={styles.scannerSubtitle}>
              Point your camera at a QR code
            </Text>
          </View>

          <Camera
            style={styles.camera}
            cameraType={CameraType.Back}
            scanBarcode={true}
            onReadCode={onReadCode}
            showFrame={true}
            laserColor="rgba(33, 150, 243, 0.5)"
            frameColor="rgba(33, 150, 243, 0.8)"
          />

          <View style={styles.bottomContent}>
            <TouchableOpacity style={styles.closeButton} onPress={closeScanner}>
              <Text style={styles.closeButtonText}>Close Camera</Text>
            </TouchableOpacity>
          </View>
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
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  scanButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  scanButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  instructionText: {
    fontSize: 16,
    color: '#666',
    marginTop: 30,
    textAlign: 'center',
  },
  resultContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginTop: 30,
    width: '100%',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  resultLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  resultText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
  scannerContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  topContent: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#2196F3',
  },
  scannerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  scannerSubtitle: {
    fontSize: 14,
    color: '#fff',
    marginTop: 5,
  },
  camera: {
    flex: 1,
  },
  bottomContent: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 20,
  },
  closeButton: {
    backgroundColor: '#f44336',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 10,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  loadingContainer: {
    backgroundColor: '#fff',
    padding: 30,
    borderRadius: 15,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
  viewDetailsButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 15,
    alignItems: 'center',
  },
  viewDetailsButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default QRScanner;
