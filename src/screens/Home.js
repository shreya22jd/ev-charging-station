import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, ActivityIndicator, TextInput, Image } from 'react-native';
import { fetchAllStations } from '../api/bapApi';
import Footer from '../common/Footer';
import Header from '../common/Header'; // Adjust the path if needed

// Import the images
import img01 from '../../assets/img01.png';

const Home = ({ navigation }) => {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredStations, setFilteredStations] = useState([]);

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

  const handleSearch = () => {
    if (searchQuery.trim() === '') {
      setFilteredStations(stations);
    } else {
      const filtered = stations.filter(station =>
        station.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredStations(filtered);
    }
  };

  const renderStation = ({ item }) => (
    <View style={styles.stationCard}>
      <Image source={img01} style={styles.stationImage} />

      <View style={styles.stationDetails}>
        <Text style={styles.stationName}>{item.name}</Text>
        <Text style={styles.stationLocation}>
          {item.address ? item.address : 'Address not available'}
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
    <View style={styles.container}>
      <Header title="Home" />
      {/* Search Input */}
      <TextInput
        style={styles.searchInput}
        placeholder="Search Stations"
        value={searchQuery}
        onChangeText={text => setSearchQuery(text)}
        onSubmitEditing={handleSearch}
      />

      {/* Station List */}
      <FlatList
        data={filteredStations}
        renderItem={renderStation}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.stationList}
        showsVerticalScrollIndicator={false} // <== Hides scroll indicator
      />

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
  searchInput: {
    width: '100%',
    padding: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    fontSize: 16,
  },
  stationList: {
    paddingBottom: 80, // So that the last item is not hidden behind the Footer
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
    backgroundColor: '#2DBE7C',
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
