import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Image,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { fetchAllStations } from '../api/bapApi';
import Footer from '../common/Footer';
import Header from '../common/Header';
import SearchSection from '../common/SearchSection';

import img01 from '../../assets/img01.png';

const Home = ({ navigation }) => {
  const [stations, setStations] = useState([]);
  const [filteredStations, setFilteredStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [username, setUsername] = useState('');

  // Fetch stations
  useEffect(() => {
    const loadStations = async () => {
      try {
        const result = await fetchAllStations();
        setStations(result);
        setFilteredStations(result);
      } catch (err) {
        console.error('Error fetching stations:', err);
        setError('Failed to fetch stations');
      } finally {
        setLoading(false);
      }
    };

    loadStations();
  }, []);

  // Fetch username from storage
  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3Y2MxNDRiYWY1YzI5ZjUyMTcyZGY3NiIsImlhdCI6MTc0MjQ0NjUzOCwiZXhwIjoxNzczOTgyNTM4fQ.MFrsevI_POX8uAny7BWhvA_W5hRVFW51W6FPyp7R_XY`;
        const userId = await AsyncStorage.getItem("userId");

        if (!token || !userId) return;

        const response = await fetch(`http://192.168.29.243:5000/api/auth/user/${userId}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();
        if (response.ok && data?.username) {
          setUsername(data.username);
        }
      } catch (error) {
        console.log('Failed to fetch username:', error.message);
      }
    };

    fetchUsername();
  }, []);

  const renderStation = ({ item }) => (
    <View style={styles.stationCard}>
      <Image source={img01} style={styles.stationImage} />
      <View style={styles.stationDetails}>
        <Text style={styles.stationName}>{item.name}</Text>
        <Text style={styles.stationLocation}>
          {item.address || 'Address not available'}
        </Text>
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('BookSlot', { stationId: item._id })}
      >
        <Text style={styles.buttonText}>View Details</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
  <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
<Header title={`Welcome, ${username || 'User'}!`} />
    
    <View style={styles.container}>
      <SearchSection
        stations={stations}
        onResults={setFilteredStations}
        onLoading={setLoading}
      />

      <FlatList
        data={filteredStations}
        renderItem={renderStation}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.stationList}
        showsVerticalScrollIndicator={false}
      />
    </View>

    <Footer navigation={navigation} />
  </View>
);

};

export default Home;

const styles = StyleSheet.create({
 container: {
  flex: 1,
  padding: 20,
  backgroundColor: '#f5f5f5',
},

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stationList: {
    paddingBottom: 80,
  },
  stationCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 3,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stationName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  stationLocation: {
    fontSize: 16,
    color: '#666',
    marginVertical: 5,
  },
  button: {
    backgroundColor: '#5bc99d',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignSelf: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  errorText: {
    fontSize: 18,
    color: 'red',
  },
  stationImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    borderRadius: 10,
    marginBottom: 10,
  },
  stationDetails: {
    alignItems: 'center',
    marginBottom: 10,
  },
});
