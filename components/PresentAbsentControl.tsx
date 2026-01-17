import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import React from 'react';

const PresentAbsentControl = ({ data }: any) => {
  const will_come =
    data?.will_come === 1 ? true : data?.will_come === 0 ? false : null;

  const handlePresent = () => {
    console.log('Present pressed', data);
    // TODO: Update attendance status to present (will_come = 1)
  };

  const handleAbsent = () => {
    console.log('Absent pressed', data);
    // TODO: Update attendance status to absent (will_come = 0)
  };

  // When null, show both buttons
  if (will_come === null) {
    return (
      <View style={styles.container}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.presentButton]}
            onPress={handlePresent}
          >
            <Text style={styles.buttonText}>Present</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.absentButton]}
            onPress={handleAbsent}
          >
            <Text style={styles.buttonText}>Absent</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // When present (1), show Present text and Absent button
  if (will_come) {
    return (
      <View style={styles.container}>
        <View style={styles.buttonContainer}>
          <View style={[styles.button, styles.presentStatus]}>
            <Text style={[styles.buttonText, styles.statusText]}>
              Present Selected
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.button, styles.absentButton]}
            onPress={handleAbsent}
          >
            <Text style={styles.buttonText}>Mark Absent</Text>
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
          style={[styles.button, styles.presentButton]}
          onPress={handlePresent}
        >
          <Text style={styles.buttonText}>Mark Present</Text>
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
