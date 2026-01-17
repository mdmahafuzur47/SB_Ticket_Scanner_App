import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import React from 'react';

const PresentAbsentControl = ({ data }: any) => {
  console.log(data);
  const will_come = data?.will_come === 1;

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

  // When present (1), show Present status and Absent button
  if (will_come) {
    return (
      <View style={styles.container}>
        <View style={styles.buttonContainer}>
          <View style={[styles.button, styles.presentStatus]}>
            <Text style={styles.buttonText}>Present</Text>
          </View>
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

  // When absent (0), show Present button and Absent status
  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.presentButton]}
          onPress={handlePresent}
        >
          <Text style={styles.buttonText}>Present</Text>
        </TouchableOpacity>
        <View style={[styles.button, styles.absentStatus]}>
          <Text style={styles.buttonText}>Absent</Text>
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
  },
  button: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  presentButton: {
    backgroundColor: '#4CAF50',
    opacity: 0.8,
  },
  absentButton: {
    backgroundColor: '#F44336',
    opacity: 0.8,
  },
  presentStatus: {
    backgroundColor: '#4CAF50',
  },
  absentStatus: {
    backgroundColor: '#F44336',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PresentAbsentControl;
