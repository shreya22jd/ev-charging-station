import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const BookingDetails = ({ route }) => {
  const { booking } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Booking Details</Text>

      <Text style={styles.detail}><Text style={styles.label}>Date:</Text> {new Date(booking.date).toLocaleString()}</Text>
      <Text style={styles.detail}><Text style={styles.label}>Station:</Text> {booking.stationName || 'N/A'}</Text>
      <Text style={styles.detail}><Text style={styles.label}>Point Number:</Text> {booking.pointNumber}</Text>
      <Text style={styles.detail}><Text style={styles.label}>Charging Type:</Text> {booking.typeName}</Text>
      <Text style={styles.detail}><Text style={styles.label}>Start Time:</Text> {booking.startTime}</Text>
      <Text style={styles.detail}><Text style={styles.label}>End Time:</Text> {booking.endTime}</Text>
      <Text style={styles.detail}><Text style={styles.label}>Total Amount:</Text> ₹{booking.amount}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
    flex: 1,
  },
  title: {
    fontSize: 22,
    marginBottom: 20,
    fontWeight: "bold",
  },
  detail: {
    fontSize: 16,
    marginBottom: 10,
  },
  label: {
    fontWeight: 'bold',
  },
});

export default BookingDetails;
