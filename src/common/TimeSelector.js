import React, { useState } from 'react';
import { View, Text, Pressable, Platform, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const TimeSelector = ({ label, value, onChange }) => {
  const [show, setShow] = useState(false);

  const showPicker = () => setShow(true);

  const handleChange = (event, selectedDate) => {
    setShow(Platform.OS === 'ios');
    if (selectedDate) {
      onChange(selectedDate);
    }
  };

  const formatTime = (date) => {
    if (!date || !(date instanceof Date)) return 'Select Time';
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const isPM = hours >= 12;
    const formattedHours = ((hours + 11) % 12 + 1).toString().padStart(2, '0');
    const formattedMinutes = minutes.toString().padStart(2, '0');
    return `${formattedHours}:${formattedMinutes} ${isPM ? 'PM' : 'AM'}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      <Pressable onPress={showPicker} style={styles.inputBox}>
        <Text style={styles.timeText}>{formatTime(value)}</Text>
      </Pressable>

      {show && (
        <DateTimePicker
          mode="time"
          value={value instanceof Date ? value : new Date()}
          is24Hour={false}
          display={Platform.OS === 'android' ? 'default' : 'spinner'}
          onChange={handleChange}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
     fontWeight: 'bold',
    marginBottom: 6,
    color: '#444',
  },
  inputBox: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 14,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  timeText: {
    fontSize: 16,
    color: '#222',
  }
});

export default TimeSelector;
