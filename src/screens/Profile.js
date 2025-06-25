import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import Icon from 'react-native-vector-icons/Feather';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

import Header from "../common/Header";
import Footer from "../common/Footer";

const Profile = () => {
  const navigation = useNavigation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserDetails();
  }, []);

  const fetchUserDetails = async () => {
    try {
      const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3Y2MxNDRiYWY1YzI5ZjUyMTcyZGY3NiIsImlhdCI6MTc0MjQ0NjUzOCwiZXhwIjoxNzczOTgyNTM4fQ.MFrsevI_POX8uAny7BWhvA_W5hRVFW51W6FPyp7R_XY`;
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

  const MenuItem = ({ label, icon, onPress, color = "#333" }) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={styles.iconLabel}>
        <Icon name={icon} size={22} color={color} />
        <Text style={[styles.menuText, { color }]}>{label}</Text>
      </View>
      <Icon name="chevron-right" size={20} color="#999" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Header title="Profile" />

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {loading ? (
          <ActivityIndicator size="large" color="#2DBE7C" />
        ) : user && user.username ? (
          <>
           <View style={styles.profileCard}>
  <Icon name="user" size={80} color="#5bc99d" />
  <Text style={styles.profileName}>{user.username}</Text>
  <Text style={styles.profileEmail}>{user.email}</Text>
</View>


            <View style={styles.menuContainer}>
              <MenuItem
                label="Account"
                icon="user"
                onPress={() => navigation.navigate("Account")}
              />
              <MenuItem
                label="Your Bookings"
                icon="calendar"
                onPress={() => navigation.navigate("History")}
              />
              <MenuItem
                label="Privacy Policy"
                icon="lock"
                onPress={() => navigation.navigate("PrivacyPolicy")}
              />
              <MenuItem
                label="Terms & Conditions"
                icon="file-text"
                onPress={() => navigation.navigate("TermsConditions")}
              />
              <MenuItem
                label="Reset Password"
                icon="key"
                onPress={() => navigation.navigate("ResetPassword")}
              />
              <MenuItem
                label="Logout"
                icon="log-out"
                onPress={() =>
                  Alert.alert(
                    "Confirm Logout",
                    "Are you sure you want to log out?",
                    [
                      { text: "Cancel", style: "cancel" },
                      {
                        text: "Yes",
                        onPress: () => navigation.navigate("getstartpage"),
                      },
                    ],
                    { cancelable: false }
                  )
                }
                color="red"
              />
            </View>
          </>
        ) : (
          <Text style={styles.errorText}>
            Error: No user data received.
          </Text>
        )}
      </ScrollView>

      <Footer navigation={navigation} />
    </View>
  );
};

export default Profile;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollContainer: {
    paddingBottom: 30,
  },
  profileHeader: {
    alignItems: "center",
    paddingVertical: 30,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  profileName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginTop: 10,
  },
  profileEmail: {
    fontSize: 16,
    color: "#777",
    marginTop: 5,
  },
  menuContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  menuItem: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  iconLabel: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  menuText: {
    fontSize: 16,
    fontWeight: "500",
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
  },
  profileCard: {
  backgroundColor: "#fff",
  marginHorizontal: 20,
  paddingVertical: 30,
  paddingHorizontal: 20,
  borderRadius: 12,
  alignItems: "center",
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.1,
  shadowRadius: 6,
  elevation: 5,
  marginTop: 20,
  marginBottom: 10,
},

});
