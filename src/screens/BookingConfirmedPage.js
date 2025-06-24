import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const BookingConfirmedPage = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.successText}>🎉 Booking Confirmed! 🎉</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  successText: { fontSize: 24, fontWeight: 'bold', color: 'green' }
});

export default BookingConfirmedPage;
