import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

// const ApiUrl = 'https://admin.skillbridgebd.com/api/admin/v1/applications';
const ApiUrl = 'http://192.168.100.208:8000/api/admin/v1/applications';

const PresentAbsentControl = ({ application_id, data, onUpdate }: any) => {
  const token = 'mafuzadmin2024token'; // Placeholder token
  const [attendanceStatus, setAttendanceStatus] = useState(
    data?.attendance === 1 ? true : data?.attendance === 0 ? false : null,
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setAttendanceStatus(
      data?.attendance === 1 ? true : data?.attendance === 0 ? false : null,
    );
  }, [data]);

  const handlePresent = async () => {
    if (loading) return; // Prevent multiple clicks
    console.log('Present pressed', data);
    setAttendanceStatus(true); // Optimistic update
    setLoading(true);
    try {
      const response = await axios.post(
        `${ApiUrl}/${application_id}/updateAttendanceByToken`,
        {
          schedule_id: data.schedule_id,
          is_present: 1,
          token: token,
        },
      );
      console.log('Attendance updated to present:', response.data);
      if (onUpdate) onUpdate();
    } catch (error: any) {
      console.error(
        'Error updating attendance:',
        error.response?.data?.message || error.message,
      );
      setAttendanceStatus(
        data?.attendance === 1 ? true : data?.attendance === 0 ? false : null,
      ); // Revert on error
    } finally {
      setLoading(false);
    }
  };

  const handleAbsent = async () => {
    if (loading) return; // Prevent multiple clicks
    console.log('Absent pressed', data);
    setAttendanceStatus(false); // Optimistic update
    setLoading(true);
    try {
      const response = await axios.post(
        `${ApiUrl}/${application_id}/updateAttendanceByToken`,
        {
          schedule_id: data.schedule_id,
          is_present: 0,
          token: token,
        },
      );
      console.log('Attendance updated to absent:', response.data);
      if (onUpdate) onUpdate();
    } catch (error: any) {
      console.error(
        'Error updating attendance:',
        error.response?.data?.message || error.message,
      );
      setAttendanceStatus(
        data?.attendance === 1 ? true : data?.attendance === 0 ? false : null,
      ); // Revert on error
    } finally {
      setLoading(false);
    }
  };

  // When null, show both buttons
  if (attendanceStatus === null) {
    return (
      <View style={styles.container}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.button,
              styles.presentButton,
              loading && styles.disabledButton,
            ]}
            onPress={handlePresent}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Present</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.button,
              styles.absentButton,
              loading && styles.disabledButton,
            ]}
            onPress={handleAbsent}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Absent</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // When present (1), show Present text and Absent button
  if (attendanceStatus) {
    return (
      <View style={styles.container}>
        <View style={styles.buttonContainer}>
          <View style={[styles.button, styles.presentStatus]}>
            <Text style={[styles.buttonText, styles.statusText]}>
              Present Selected
            </Text>
          </View>
          <TouchableOpacity
            style={[
              styles.button,
              styles.absentButton,
              loading && styles.disabledButton,
            ]}
            onPress={handleAbsent}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Mark Absent</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // When absent (0), show Present button and Absent text
  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.button,
            styles.presentButton,
            loading && styles.disabledButton,
          ]}
          onPress={handlePresent}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Mark Present</Text>
          )}
        </TouchableOpacity>
        <View style={[styles.button, styles.absentStatus]}>
          <Text style={[styles.buttonText, styles.statusText]}>
            Absent Selected
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    width: '100%',
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
  },
  presentButton: {
    backgroundColor: '#4CAF50',
  },
  absentButton: {
    backgroundColor: '#F44336',
  },
  disabledButton: {
    opacity: 0.6,
  },
  presentStatus: {
    backgroundColor: '#E8F5E8',
    borderRightWidth: 1,
    borderRightColor: '#ddd',
  },
  absentStatus: {
    backgroundColor: '#FFEBEE',
    borderLeftWidth: 1,
    borderLeftColor: '#ddd',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  statusText: {
    color: '#333',
  },
});

export default PresentAbsentControl;
