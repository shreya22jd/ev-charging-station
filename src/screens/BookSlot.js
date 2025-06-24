import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  Alert,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import TimeSelector from '../common/TimeSelector.js';
import io from "socket.io-client";
import PayBill from '../common/PayBill.js';
import Header2 from '../common/Header2.js';

const socket = io("http://192.168.29.243:5000");

const BookSlot = ({ route }) => {
  const { stationId } = route.params;
  const navigation = useNavigation();

  const [startTime, setStartTime] = useState(() => {
    const now = new Date();
    now.setHours(10, 0, 0, 0);
    return now;
  });
  const [endTime, setEndTime] = useState(() => {
    const now = new Date();
    now.setHours(10, 30, 0, 0);
    return now;
  });

  const [chargingPoints, setChargingPoints] = useState([]);
  const [pointNumber, setPointNumber] = useState(null);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [userId, setUserId] = useState(null);
  const [typeName, setTypeName] = useState("");
  const [availableTypes, setAvailableTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [billAmount, setBillAmount] = useState(null);

  const fetchUserDetails = async () => {
    try {
      const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3Y2MxNDRiYWY1YzI5ZjUyMTcyZGY3NiIsImlhdCI6MTc0MjQ0NjUzOCwiZXhwIjoxNzczOTgyNTM4fQ.MFrsevI_POX8uAny7BWhvA_W5hRVFW51W6FPyp7R_XY`;
      const storedUserId = await AsyncStorage.getItem("userId");

      if (!token || !storedUserId) {
        Alert.alert("Error", "Unauthorized! Please login again.");
        navigation.navigate("Login");
        return;
      }

      const response = await fetch(
        `http://192.168.29.243:5000/api/auth/user/${storedUserId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setUserId(data._id);
      } else {
        Alert.alert("Error", data.message || "Failed to fetch user data.");
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong while fetching user details.");
    } finally {
      setLoading(false);
    }
  };

  const fetchChargingPoints = async () => {
    try {
      const res = await axios.get(`http://192.168.29.243:5000/beckn/selectone/${stationId}`);
      const points = res.data.chargingPoints || [];

      setChargingPoints(points);

      if (points.length > 0) {
        setPointNumber(points[0].pointNumber);
        setBookedSlots(points[0].slots || []);
        setAvailableTypes(points[0].types || []);
        if (points[0].types.length > 0) {
          setTypeName(points[0].types[0].typeName);
        }
      }
    } catch (error) {
      console.error("Error fetching charging points:", error);
    }
  };

  const onPointChange = (value) => {
    const num = parseInt(value);
    setPointNumber(num);

    const selectedPoint = chargingPoints.find(p => p.pointNumber === num);
    setBookedSlots(selectedPoint?.slots || []);
    setAvailableTypes(selectedPoint?.types || []);
    if (selectedPoint?.types?.length > 0) {
      setTypeName(selectedPoint.types[0].typeName);
    } else {
      setTypeName("");
    }
  };

  useEffect(() => {
    socket.on('billAmountUpdate', (data) => {
      console.log('Received billAmount from server:', data.billAmount);
      setBillAmount(data.billAmount);
      Alert.alert("Success", `Booking Confirmed. Bill: ₹${data.billAmount}`);
    });

    return () => {
      socket.off('billAmountUpdate');
    };
  }, []);

  const bookSlot = async () => {
    if (!userId) {
      Alert.alert("Error", "User not authenticated.");
      return;
    }

    if (!typeName) {
      Alert.alert("Error", "Please select a type.");
      return;
    }

    if (!startTime || !endTime) {
      Alert.alert("Error", "Please select both start and end times.");
      return;
    }

    const durationInHours = (endTime - startTime) / (1000 * 60 * 60);
    const selectedType = availableTypes.find(t => t.typeName === typeName);

    if (!selectedType) {
      Alert.alert("Error", "Selected type not found.");
      return;
    }

    const amount = selectedType.pricePerHour * durationInHours;
    console.log("Calculated amount:", amount);

    const payload = {
      context: {
        domain: "mobility.ev",
        country: "IND",
        city: "std:080",
        action: "confirm",
        core_version: "1.0.0",
        transaction_id: "TXN123456789",
        message_id: "MSG987654321",
        timestamp: new Date().toISOString(),
        bap_id: "bap.ev-booking.com",
        bpp_id: "bpp.ev-provider.com"
      },
      message: {
        order: {
          provider: { id: stationId },
          billing: {
            userId: userId,
            amount: amount
          },
          items: [
            { id: typeName }
          ],
          fulfillment: {
            start: {
              location: { gps: "1" },
              time: { timestamp: startTime.toISOString() },
              point: { id: pointNumber }
            },
            end: {
              time: { timestamp: endTime.toISOString() }
            }
          }
        }
      }
    };

    try {
      await axios.post('http://192.168.29.243:5000/beckn/confirm', payload);
    } catch (error) {
      console.log(error);
      Alert.alert("Error", error.response?.data?.message || "Something went wrong");
    }
  };

  const formatTimeSlot = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);

    const startTime = `${startDate.getHours() % 12 || 12}:${startDate.getMinutes().toString().padStart(2, '0')} ${startDate.getHours() >= 12 ? 'PM' : 'AM'}`;
    const endTime = `${endDate.getHours() % 12 || 12}:${endDate.getMinutes().toString().padStart(2, '0')} ${endDate.getHours() >= 12 ? 'PM' : 'AM'}`;

    return `${startTime} ~ ${endTime}`;
  };

  const removeSlot = async (slotIndex) => {
    const slot = bookedSlots[slotIndex];
    const endTime = new Date(slot.endTime);
    const currentTime = new Date();

    if (currentTime >= endTime) {
      try {
        const response = await axios.post(`http://192.168.29.243:5000/api/stations/${stationId}/removeSlot`, {
          pointNumber: pointNumber,
          startTime: slot.startTime,
          endTime: slot.endTime,
        });

        if (response.data.success) {
          Alert.alert("Success", "Slot removed");
          setBookedSlots(prev => prev.filter((_, idx) => idx !== slotIndex));
        } else {
          Alert.alert("Error", response.data.message || "Failed to remove slot.");
        }
      } catch (error) {
        Alert.alert("Error", "Something went wrong while removing the slot.");
      }
    }
  };

  useEffect(() => {
    const init = async () => {
      await fetchUserDetails();
      await fetchChargingPoints();
    };
    init();
  }, []);

  const filterPastSlots = (slots) => {
    const currentTime = new Date();
    return slots.filter(slot => new Date(slot.endTime) > currentTime);
  };

  const filteredSlots = filterPastSlots(bookedSlots);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Header2 title="Book Your Slot" />

      <Text>Select Charging Point:</Text>
      <Picker
        selectedValue={pointNumber}
        onValueChange={onPointChange}
      >
        {chargingPoints.map((point) => (
          <Picker.Item
            key={point.pointNumber}
            label={`Point ${point.pointNumber}`}
            value={point.pointNumber}
          />
        ))}
      </Picker>

      <Text>Select Charging Type:</Text>
      <Picker
        selectedValue={typeName}
        onValueChange={(value) => setTypeName(value)}
      >
        {availableTypes.map((type, idx) => (
          <Picker.Item
            key={idx}
            label={`${type.typeName} (${type.kwh} kWh) - ₹${type.pricePerHour}/hr`}
            value={type.typeName}
          />
        ))}
      </Picker>

      <TimeSelector label="Start Time:" value={startTime} onChange={setStartTime} />
      <TimeSelector label="End Time:" value={endTime} onChange={setEndTime} />

      <Button title="Book Slot" onPress={bookSlot} />

      <Text style={styles.subtitle}>Already Booked Slots:</Text>
      {filteredSlots.length === 0 ? (
        <Text>No bookings yet</Text>
      ) : (
        filteredSlots.map((slot, index) => (
          <View key={index}>
            <TouchableOpacity style={styles.slotBox} onPress={() => removeSlot(index)}>
              <Text>{formatTimeSlot(slot.startTime, slot.endTime)}</Text>
            </TouchableOpacity>
          </View>
        ))
      )}

      <PayBill
  userId={userId}
  stationId={stationId}
  pointNumber={pointNumber}
  typeName={typeName}
  startTime={startTime}
  endTime={endTime}
  amount={billAmount || 0} // Pass the calculated bill amount or 0 as fallback
/>

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
  subtitle: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: "bold",
  },
  slotBox: {
    backgroundColor: '#ddd',
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
  }
});

export default BookSlot;
