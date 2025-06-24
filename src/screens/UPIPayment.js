import React, { useEffect, useState } from 'react';
import { View, Button, Alert, StyleSheet, Text, Linking, AppState, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const UPIPayment = ({ amount }) => {
  const navigation = useNavigation();
  const [paymentStarted, setPaymentStarted] = useState(false);
  const [transactionId, setTransactionId] = useState('');

  const payeeVPA = 'Q167630538@ybl';
  const payeeName = 'ANUPAMA AVENUE';

  useEffect(() => {
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => {
      subscription.remove();
    };
  }, [paymentStarted]);

  const handleAppStateChange = (nextAppState) => {
    if (paymentStarted && nextAppState === 'active') {
      Alert.alert(
        'Payment Confirmation',
        'Did you complete the payment?',
        [
          {
            text: 'Yes',
            onPress: () => {
              // Ask user to enter transaction ID manually after payment
            },
          },
          {
            text: 'No',
            onPress: () => Alert.alert('Payment not completed', 'Please try again.'),
            style: 'cancel',
          },
        ],
        { cancelable: false }
      );
      setPaymentStarted(false); // reset flag
    }
  };

  const makeUPIPayment = async () => {
    if (!amount) {
      Alert.alert('Amount required', 'Bill amount missing');
      return;
    }

    const upiUrl = `upi://pay?pa=${payeeVPA}&pn=${payeeName}&am=${amount}&cu=INR`;

    try {
      const supported = await Linking.canOpenURL(upiUrl);
      if (supported) {
        setPaymentStarted(true);
        await Linking.openURL(upiUrl);
      } else {
        Alert.alert('Error', 'No UPI app found. Install Google Pay, PhonePe etc.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to initiate UPI payment.');
    }
  };

  const handleSubmitTransactionId = async () => {
    if (!transactionId.trim()) {
      Alert.alert('Error', 'Please enter the Transaction ID.');
      return;
    }

    try {
      const response = await fetch('http://192.168.29.243:5000/verify-transaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transactionId }),
      });

      const result = await response.json();

      if (result.success) {
        Alert.alert('Success', 'Payment Verified');
        navigation.navigate('BookingConfirmed');
      } else {
        Alert.alert('Failure', 'Transaction not successful. Please try again.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Could not verify transaction.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Bill Amount: ₹{amount}</Text>
      <Button title="Pay with UPI" onPress={makeUPIPayment} />

      <View style={{ marginTop: 20 }}>
        <Text style={styles.label}>Enter Transaction ID</Text>
        <TextInput
          placeholder="Transaction ID"
          value={transactionId}
          onChangeText={setTransactionId}
          style={styles.input}
        />
        <Button title="Submit Transaction ID" onPress={handleSubmitTransactionId} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginTop: 20, padding: 20, backgroundColor: '#eee', borderRadius: 10 },
  label: { fontSize: 18, marginBottom: 10, fontWeight: 'bold' },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: '#fff'
  }
});

export default UPIPayment;
