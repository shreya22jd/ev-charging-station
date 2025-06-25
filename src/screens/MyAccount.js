import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import Footer from "../common/Footer";
import Icon from "react-native-vector-icons/Feather";

const MyAccount = () => {
  const navigation = useNavigation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserDetails();
  }, []);

  const fetchUserDetails = async () => {
    try {
      const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3Y2MxNDRiYWY1YzI5ZjUyMTcyZGY3NiIsImlhdCI6MTc0MjQ0NjUzOCwiZXhwIjoxNzczOTgyNTM4fQ.MFrsevI_POX8uAny7BWhvA_W5hRVFW51W6FPyp7R_XY`; // Replace with actual token
      const userId = await AsyncStorage.getItem("userId");

      if (!token || !userId) {
        Alert.alert("Error", "Unauthorized! Please login again.");
        navigation.navigate("Login");
        return;
      }

      const response = await fetch(
        `http://192.168.29.243:5000/api/auth/user/${userId}`,
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
        setUser(data);
      } else {
        Alert.alert("Error", data.message || "Failed to fetch user data.");
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong while fetching user details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#5bc99d" />
      ) : user ? (
        <View style={styles.card}>
          <View style={styles.iconWrap}>
            <Icon name="user" size={90} color="#5bc99d" />
          </View>
          <Text style={styles.username}>{user.username}</Text>

          <View style={styles.detailsCard}>
            <Text style={styles.sectionTitle}>Account Information</Text>

            <View style={styles.detailItem}>
              <Text style={styles.label}>Email</Text>
              <Text style={styles.value}>{user.email}</Text>
            </View>

            <View style={styles.detailItem}>
              <Text style={styles.label}>Phone</Text>
              <Text style={styles.value}>{user.contactNumber}</Text>
            </View>

            <View style={styles.detailItem}>
              <Text style={styles.label}>Joined</Text>
              <Text style={styles.value}>
                {new Date(user.createdAt).toDateString()}
              </Text>
            </View>
          </View>
        </View>
      ) : (
        <Text style={styles.errorText}>Error: No user data available.</Text>
      )}
      <Footer navigation={navigation} />
    </View>
  );
};

export default MyAccount;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f4f4",
    alignItems: "center",
    paddingTop: 80,
  },
  card: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 6,
    marginBottom: 20,
  },
  iconWrap: {
    marginBottom: 15,
  },
  username: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 25,
  },
  detailsCard: {
    width: "100%",
    backgroundColor: "#f9f9f9",
    borderRadius: 15,
    padding: 20,
    shadowColor: "#ddd",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111111",
    marginBottom: 24,
    textAlign: "left",
  },
  detailItem: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",  // ⬅️ Now bold
    color: "#666",
    marginBottom: 6,
  },
  value: {
    fontSize: 18,
    fontWeight: "bold",  // ⬅️ Now bold
    color: "#222",
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: 20,
  },
});
