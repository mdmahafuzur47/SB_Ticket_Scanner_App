import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import { Camera, CameraType } from 'react-native-camera-kit';
import { InfoRow, styles } from '../ApplicationDetails';

const PassportInformation: any = ({ data }: any) => {
  const [showCamera, setShowCamera] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  const handleOpenCamera = () => {
    console.log('Opening camera...');
    setShowCamera(true);
  };

  const handleCloseCamera = () => {
    console.log('Closing camera...');
    setShowCamera(false);
  };

  const handlePassportCaptured = async () => {
    try {
      if (PassportInformation.cameraRef) {
        const image = await PassportInformation.cameraRef.capture();
        console.log('Captured Passport Image:', image);
        console.log('Image URI:', image.uri);

        setCapturedImage(image.uri);
        setShowCamera(false);

        // Log as a file object-like structure
        const imageFile = {
          uri: image.uri,
          type: 'image/jpeg',
          name: `passport_${Date.now()}.jpg`,
        };
        console.log('Image File Object:', imageFile);
      }
    } catch (error) {
      console.error('Error capturing image:', error);
    }
  };

  if (showCamera) {
    console.log('Rendering camera view...');
    return (
      <View style={localStyles.cameraContainer}>
        <View style={localStyles.cameraHeader}>
          <Text style={localStyles.cameraTitle}>Capture Passport</Text>
          <TouchableOpacity
            onPress={handleCloseCamera}
            style={localStyles.closeButton}
          >
            <Text style={localStyles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>

        <View style={localStyles.cameraWrapper}>
          <Camera
            style={localStyles.camera}
            cameraType={CameraType.Back}
            zoom={0}
            flashMode="off"
            ref={(ref: any) => {
              if (ref && !ref.capture) return;
              PassportInformation.cameraRef = ref;
              console.log('Camera ref set:', !!ref);
            }}
          />
        </View>

        <View style={localStyles.cameraFooter}>
          <TouchableOpacity style={localStyles.captureButtonWrapper} onPress={handlePassportCaptured}>
            <View style={localStyles.captureButton}>
              <Text style={localStyles.captureButtonText}>📷</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleCloseCamera}
            style={localStyles.cancelButton}
          >
            <Text style={localStyles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View>
      {data?.user && data?.user?.passport_url && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Passport Information</Text>
          <View style={styles.card}>
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: capturedImage || data?.user?.passport_url }}
                style={styles.passportImage}
                resizeMode="contain"
              />
            </View>
            <InfoRow label="Passport No" value={data?.user?.passport_no} />
            <InfoRow
              label="Passport Issue Date"
              value={data?.user?.passport_date_of_issue}
            />
            <InfoRow
              label="Passport Expiry Date"
              value={data?.user?.passport_date_of_expiry}
            />

            <TouchableOpacity
              style={localStyles.uploadButton}
              onPress={handleOpenCamera}
            >
              <Text style={localStyles.uploadButtonText}>
                📷 {capturedImage ? 'Retake' : 'Upload'} Passport Photo
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const localStyles = StyleSheet.create({
  cameraContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#00000087',
    zIndex: 9999,
    height: 550,
    borderRadius: 10,
    overflow: 'hidden',
  },
  cameraHeader: {
    backgroundColor: '#2196F3',
    padding: 10,
    paddingTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 10000,
  },
  cameraTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#fff',
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 15,
    color: '#fff',
    fontWeight: 'bold',
  },
  cameraWrapper: {
    flex: 1,
    backgroundColor: '#000',
    overflow: 'hidden',
  },
  camera: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    height: 400,
  },
  captureButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#2196F3',
  },
  cameraFooter: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 10,
    gap: 10,
  },
  captureButtonWrapper: {
    alignItems: 'center',
  },
  captureButtonText: {
    fontSize: 15,
  },
  cancelButton: {
    backgroundColor: '#f44336',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  uploadButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 16,
    alignItems: 'center',
  },
  uploadButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default PassportInformation;
