import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  Alert,
  StatusBar,
  TouchableOpacity,
  Platform,
  ScrollView,
} from "react-native";
import Icon from 'react-native-vector-icons/Feather';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
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

  return (
    <View style={styles.container}>
      {/* Custom Header */}
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Profile</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : user && user.username ? (
          <>
            <View style={styles.profileHeader}>
<Icon name="user" size={80} color="#2DBE7C" style={{ marginBottom: 20, marginTop:10 }} />
  <Text style={styles.profileName}>{user.username}</Text>
  <Text style={styles.profileEmail}>{user.email}</Text>
</View>


            <View style={styles.menuContainer}>
              <TouchableOpacity
                style={styles.optionBox}
                onPress={() => navigation.navigate("Account")}
              >
                <Text style={styles.optionText}>👤 Account</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.optionBox}
                onPress={() => navigation.navigate("History")}
              >
                <Text style={styles.optionText}>📅 Your Booking</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.optionBox}
                onPress={() => navigation.navigate("PrivacyPolicy")}
              >
                <Text style={styles.optionText}>🔒 Privacy Policy</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.optionBox}
                onPress={() => navigation.navigate("TermsConditions")}
              >
                <Text style={styles.optionText}>📜 Terms & Conditions</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.optionBox}
                onPress={() => navigation.navigate("ResetPassword")}
              >
                <Text style={styles.optionText}>🔑 Reset Password</Text>
              </TouchableOpacity>

             
// Inside your component
<TouchableOpacity
  style={[styles.optionBox, styles.logoutButton]}
  onPress={() =>
    Alert.alert(
      "Confirm Logout",
      "Are you sure you want to log out?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Yes",
          onPress: () => navigation.navigate("getstartpage")
        }
      ],
      { cancelable: false }
    )
  }
>
  <Text style={[styles.optionText, { color: "red" }]}>🚪 Logout</Text>
</TouchableOpacity>
            </View>
          </>
        ) : (
          <Text style={{ color: "red", textAlign: "center", marginTop: 20 }}>
            Error: No user data received.
          </Text>
        )}
      </ScrollView>

      {/* Footer Navigation */}
      <Footer navigation={navigation} />

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    justifyContent: "space-between",
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  headerContainer: {
    backgroundColor: "#2DBE7C",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 40,
    paddingBottom: 15,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  headerText: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
  },
  profileHeader: {
    alignItems: "center",
    marginBottom: 20,
    marginTop: 20,
  },
  profilePic: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  profileName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
  },
  profileEmail: {
    fontSize: 19,
    color: "#666",
    marginTop: 5,
  },
  menuContainer: {
    width: "90%",
    alignSelf: "center",
  },
  optionBox: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    width: "100%",
    marginBottom: 10,
    alignItems: "center",
    elevation: 3,
  },
  optionText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  logoutButton: {
    backgroundColor: "#ffe6e6",
  },
});

export default Profile;
