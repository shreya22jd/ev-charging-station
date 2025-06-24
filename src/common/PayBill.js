// PayBill.js
import React, { useState } from 'react';
import { View, Text, Button, Alert, StyleSheet } from 'react-native';
import axios from 'axios';

const PayBill = ({
  userId,
  stationId,
  pointNumber,
  typeName,
  startTime,
  endTime,
  amount // Amount now comes from parent
}) => {
  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [transactionId, setTransactionId] = useState(null);

  const handleInitiatePayment = async () => {
    if (
      !userId ||
      !stationId ||
      !pointNumber ||
      !typeName ||
      !startTime ||
      !endTime ||
      !amount
    ) {
      Alert.alert('Error', 'Missing booking/payment information.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        bill: {
          amount,
          userId,
          stationId,
          pointNumber,
          typeName,
          startTime,
          endTime
        }
      };

      const response = await axios.post(
        'http://192.168.29.243:5000/beckn/initiate-payment',
        payload
      );

      const paymentStatus = response.data?.message?.payment?.status;
      if (paymentStatus === 'INITIATED') {
        setTransactionId(response.data.message.transaction_id);
        setPaymentStatus('Payment initiated successfully!');
        Alert.alert(
          'Success',
          'Payment initiated. Proceed to complete the payment in PhonePe app.'
        );

        const upiIntentUrl =
          response.data.message.payment.phonepe.instrumentResponse.intentUrl;
        console.log('UPI Intent URL:', upiIntentUrl);
        // Linking.openURL(upiIntentUrl); // Uncomment if you want to auto-open
      } else {
        throw new Error('Payment initiation failed.');
      }
    } catch (error) {
      Alert.alert(
        'Payment Error',
        error.message || 'Failed to initiate payment'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmPayment = async () => {
    if (!transactionId) {
      Alert.alert('Error', 'No transaction ID found. Initiate payment first.');
      return;
    }

    setLoading(true);
    try {
      const payload = { transactionId };

      const response = await axios.post(
        'http://192.168.29.243:5000/beckn/confirm-payment',
        payload
      );

      const paymentStatus = response.data?.message?.payment?.status;
      if (paymentStatus === 'SUCCESS') {
        setPaymentStatus('Payment confirmed successfully!');
        Alert.alert('Success', 'Payment confirmed. Thank you!');
      } else {
        throw new Error('Payment confirmation failed.');
      }
    } catch (error) {
      Alert.alert(
        'Confirmation Error',
        error.message || 'Failed to confirm payment'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Payment Amount: ₹{amount}</Text>
      <Button
        title={loading ? 'Processing...' : 'Initiate Payment'}
        onPress={handleInitiatePayment}
        disabled={loading}
      />
      <View style={{ marginTop: 10 }} />
      <Button
        title={loading ? 'Processing...' : 'Confirm Payment'}
        onPress={handleConfirmPayment}
        disabled={loading}
      />
      {paymentStatus && <Text style={styles.status}>{paymentStatus}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginTop: 20, padding: 10 },
  status: { marginTop: 10, color: 'green' }
});

export default PayBill;
