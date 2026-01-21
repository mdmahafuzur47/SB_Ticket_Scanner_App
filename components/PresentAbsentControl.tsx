import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { token, Url } from '../config/env';

// const ApiUrl = 'https://admin.skillbridgebd.com/api/admin/v1/applications';
const ApiUrl = `${Url}/admin/v1/applications`;

const PresentAbsentControl = ({ application_id, data, onUpdate }: any) => {
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
        <View style={styles.selectedContainer}>
          <View style={styles.selectedBadge}>
            <Text style={styles.selectedBadgeText1}>✓ Marked as Present</Text>
          </View>
          <TouchableOpacity
            style={[
              styles.changeButton,
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
      <View style={styles.selectedContainer}>
        <View style={[styles.selectedBadge]}>
          <Text style={styles.selectedBadgeText}>✗ Marked as Absent</Text>
        </View>
        <TouchableOpacity
          style={[
            styles.changeButton,
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
    borderWidth: 0,
    borderColor: '#ddd',
    gap: 5,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 35,
    borderRadius: 6,
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
  selectedContainer: {
    flexDirection: 'column',
    width: '100%',
    gap: 12,
  },
  selectedBadge: {
    alignItems: 'center',
  },
  selectedBadgeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
  },
  selectedBadgeText1: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
  },
  changeButton: {
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
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
    color: '#ffff',
  },
  statusText: {
    color: '#333',
  },
});

export default PresentAbsentControl;
