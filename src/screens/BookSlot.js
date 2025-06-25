import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ScrollView,
  TouchableOpacity,
  Platform
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import TimeSelector from '../common/TimeSelector';
import io from 'socket.io-client';
import axios from 'axios';
import Header2 from '../common/Header2';

const socket = io("http://192.168.29.243:5000");

const BookSlot = ({ route }) => {
  const { stationId } = route.params;
  const navigation = useNavigation();

  const [startTime, setStartTime] = useState(() => {
    const date = new Date();
    date.setHours(10, 0, 0, 0);
    return date;
  });

  const [endTime, setEndTime] = useState(() => {
    const date = new Date();
    date.setHours(10, 30, 0, 0);
    return date;
  });

  const [chargingPoints, setChargingPoints] = useState([]);
  const [pointNumber, setPointNumber] = useState(null);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [userId, setUserId] = useState(null);
  const [typeName, setTypeName] = useState("");
  const [availableTypes, setAvailableTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [billAmount, setBillAmount] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const [transactionId, setTransactionId] = useState(null);

  useEffect(() => {
    socket.on('billAmountUpdate', (data) => {
      setBillAmount(data.billAmount);
      Alert.alert("Success", `Booking Confirmed. Bill: ₹${data.billAmount}`);
    });

    return () => {
      socket.off('billAmountUpdate');
    };
  }, []);

  useEffect(() => {
    const init = async () => {
      await fetchUserDetails();
      await fetchChargingPoints();
    };
    init();
  }, []);

  const fetchUserDetails = async () => {
    try {
      const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3Y2MxNDRiYWY1YzI5ZjUyMTcyZGY3NiIsImlhdCI6MTc0MjQ0NjUzOCwiZXhwIjoxNzczOTgyNTM4fQ.MFrsevI_POX8uAny7BWhvA_W5hRVFW51W6FPyp7R_XY`;
      const storedUserId = await AsyncStorage.getItem("userId");

      if (!token || !storedUserId) {
        Alert.alert("Error", "Unauthorized! Please login again.");
        navigation.navigate("Login");
        return;
      }

      const response = await fetch(`http://192.168.29.243:5000/api/auth/user/${storedUserId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await response.json();
      if (response.ok) setUserId(data._id);
    } catch (error) {
      Alert.alert("Error", "Failed to fetch user details.");
    } finally {
      setLoading(false);
    }
  };

  const fetchChargingPoints = async () => {
    try {
      const res = await fetch(`http://192.168.29.243:5000/beckn/selectone/${stationId}`);
      const data = await res.json();
      const points = data.chargingPoints || [];

      setChargingPoints(points);

      if (points.length > 0) {
        const point = points[0];
        setPointNumber(point.pointNumber);
        setBookedSlots(point.slots || []);
        setAvailableTypes(point.types || []);
        if (point.types?.length) {
          setTypeName(point.types[0].typeName);
        }
      }
    } catch (error) {
      Alert.alert("Error", "Failed to fetch charging points.");
    }
  };

  const onPointChange = (value) => {
    const num = parseInt(value);
    setPointNumber(num);

    const selectedPoint = chargingPoints.find(p => p.pointNumber === num);
    setBookedSlots(selectedPoint?.slots || []);
    setAvailableTypes(selectedPoint?.types || []);
    setTypeName(selectedPoint?.types[0]?.typeName || "");
  };

  const handleBookPress = () => {
    if (!userId || !pointNumber || !typeName || !startTime || !endTime) {
      Alert.alert("Error", "Please fill all fields.");
      return;
    }
    setShowConfirm(true);
  };

  const confirmBooking = async () => {
    const selectedType = availableTypes.find(t => t.typeName === typeName);
    const durationInHours = (endTime - startTime) / (1000 * 60 * 60);
    const amount = Math.round(selectedType.pricePerHour * durationInHours * 10) / 10;

    // Check for slot overlap
    const isSlotTaken = bookedSlots.some(slot => {
      const bookedStart = new Date(slot.startTime);
      const bookedEnd = new Date(slot.endTime);
      return (
        (startTime >= bookedStart && startTime < bookedEnd) ||
        (endTime > bookedStart && endTime <= bookedEnd) ||
        (startTime <= bookedStart && endTime >= bookedEnd)
      );
    });

    if (isSlotTaken) {
      Alert.alert("Slot Unavailable", "This slot is already booked. Please choose another.");
      return;
    }

    // Initiate Payment
    try {
      const payRes = await axios.post("http://192.168.29.243:5000/beckn/initiate-payment", {
        bill: {
          amount,
          userId,
          stationId,
          pointNumber,
          typeName,
          startTime,
          endTime
        }
      });

      const upiStatus = payRes.data?.message?.payment?.status;
      if (upiStatus !== "INITIATED") throw new Error("Payment initiation failed");

      setTransactionId(payRes.data.message.transaction_id);

      // Confirm payment
      const confirmRes = await axios.post("http://192.168.29.243:5000/beckn/confirm-payment", {
        transactionId: payRes.data.message.transaction_id
      });

      const confirmStatus = confirmRes.data?.message?.payment?.status;
      if (confirmStatus !== "SUCCESS") throw new Error("Payment confirmation failed");

      // Book the slot now
      const bookingPayload = {
        message: {
          order: {
            provider: { id: stationId },
            billing: { userId, amount },
            items: [{ id: typeName }],
            fulfillment: {
              start: {
                time: { timestamp: new Date(startTime).toISOString() },
                point: { id: pointNumber }
              },
              end: {
                time: { timestamp: new Date(endTime).toISOString() }
              }
            }
          }
        }
      };

      await fetch('http://192.168.29.243:5000/beckn/confirm', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingPayload)
      });

      Alert.alert("Success", "Booking confirmed successfully.");
      setShowConfirm(false);
      fetchChargingPoints(); // refresh booked slots
    } catch (error) {
      Alert.alert("Error", error.message || "Booking/payment failed");
    }
  };

  const formatTimeSlot = (start, end) => {
    const s = new Date(start);
    const e = new Date(end);
    return `${s.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ~ ${e.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  };

  const filteredSlots = bookedSlots.filter(slot => new Date(slot.endTime) > new Date());

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Header2 title="Book Your Slot" />

      <View style={styles.card}>
        <Text style={styles.label}>Select Charging Point</Text>
        <View style={styles.inputBox}>
          <Picker
            selectedValue={pointNumber}
            onValueChange={onPointChange}
            style={styles.picker}
          >
            {chargingPoints.map((point) => (
              <Picker.Item key={point.pointNumber} label={`Point ${point.pointNumber}`} value={point.pointNumber} />
            ))}
          </Picker>
        </View>

        <Text style={styles.label}>Select Charging Type</Text>
        <View style={styles.inputBox}>
          <Picker
            selectedValue={typeName}
            onValueChange={(value) => setTypeName(value)}
            style={styles.picker}
          >
            {availableTypes.map((type, idx) => (
              <Picker.Item key={idx} label={`${type.typeName} (${type.kwh} kWh) - ₹${type.pricePerHour}/hr`} value={type.typeName} />
            ))}
          </Picker>
        </View>

        <TimeSelector label="Start Time" value={startTime} onChange={setStartTime} />
        <TimeSelector label="End Time" value={endTime} onChange={setEndTime} />

        {!showConfirm ? (
          <TouchableOpacity style={styles.button} onPress={handleBookPress}>
            <Text style={styles.buttonText}>BOOK SLOT</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={[styles.button, { backgroundColor: '#0066cc' }]} onPress={confirmBooking}>
            <Text style={styles.buttonText}>CONFIRM BOOKING</Text>
          </TouchableOpacity>
        )}
      </View>

    <Text style={styles.sectionTitle}>Already Booked Slots</Text>
<View style={styles.slotContainer}>
  {filteredSlots.length === 0 ? (
    <Text style={styles.noSlotText}>No bookings yet</Text>
  ) : (
    filteredSlots.map((slot, index) => (
      <View key={index} style={styles.slotCard}>
        <Text style={styles.slotTimeValue}>
          {formatTimeSlot(slot.startTime, slot.endTime)}
        </Text>
      </View>
    ))
  )}
</View>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 50,
    backgroundColor: "#f5f5f5",
    flexGrow: 1,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    paddingTop: 30,
    marginBottom: 30,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 4,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: "#444",
  },
  inputBox: {
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    marginBottom: 15,
    overflow: "hidden",
  },
  picker: {
    height: Platform.OS === "ios" ? 200 : 50,
    width: "100%",
  },
  button: {
    backgroundColor: "#5bc99d",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
  },
  slotBox: {
    backgroundColor: '#e6f2f0',
    padding: 12,
    marginVertical: 6,
    borderRadius: 6,
  },
  slotContainer: {
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'space-between',
  gap: 10,
},

slotCard: {
  backgroundColor: '#ffffff',
  paddingVertical: 10,
  paddingHorizontal: 15,
  borderRadius: 8,
  marginBottom: 10,
  minWidth: '48%',
  alignItems: 'center',
  justifyContent: 'center',
  elevation: 3, // Android shadow
  shadowColor: '#000', // iOS shadow
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
},

slotTimeValue: {
  fontSize: 14,
  fontWeight: 'bold',
  color: '#111',

},

noSlotText: {
  color: '#777',
  fontStyle: 'italic',
  fontSize: 15,
  paddingVertical: 10,
},

});

export default BookSlot;
