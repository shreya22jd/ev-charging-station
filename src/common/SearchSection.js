import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Pressable,
  Dimensions,
} from 'react-native';
import * as Location from 'expo-location';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome';

const screenWidth = Dimensions.get('window').width;

const SearchSection = ({ stations, onResults, onLoading }) => {
  const [filterType, setFilterType] = useState('name');
  const [query, setQuery] = useState('');
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const handleSearch = async () => {
    const name = filterType === 'name' ? query.trim().toLowerCase() : '';
    const city = filterType === 'place' ? query.trim().toLowerCase() : '';
    const distance = filterType === 'distance' ? parseFloat(query) || 10 : 10;

    let latitude = null;
    let longitude = null;

    if (!name && !city && filterType !== 'distance') {
      onResults(stations);
      return;
    }

    try {
      onLoading(true);

      if (filterType === 'distance') {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          alert('Location permission is required');
          return;
        }

        const location = await Location.getCurrentPositionAsync({});
        latitude = location.coords.latitude;
        longitude = location.coords.longitude;
      }

      const payload = {
        name,
        city,
        distance,
        ...(latitude && longitude ? { latitude, longitude } : {})
      };

      console.log('📤 Sending payload:', payload);
      await axios.post('http://192.168.29.243:5000/beckn/search', payload);

      const response = await axios.get('http://192.168.29.243:5000/beckn/get_latest');
      onResults(response.data.stations || []);
    } catch (err) {
      console.error('❌ Beckn Search Error:', err.message);
      onResults([]);
    } finally {
      onLoading(false);
    }
  };

  return (
    <View style={styles.searchWrapper}>
      <View style={styles.headerRow}>
        <Text style={styles.label}>Search By: {filterType}</Text>
        <TouchableOpacity onPress={() => setDropdownVisible(true)}>
          <Icon name="filter" size={24} color="#5bc99d" />
        </TouchableOpacity>
      </View>

      {/* Dropdown Modal */}
      <Modal
        transparent
        visible={dropdownVisible}
        animationType="fade"
        onRequestClose={() => setDropdownVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setDropdownVisible(false)}>
          <View style={styles.dropdownContainer}>
            <View style={styles.dropdown}>
              {['name', 'place', 'distance'].map((type) => (
                <TouchableOpacity
                  key={type}
                  onPress={() => {
                    setFilterType(type);
                    setDropdownVisible(false);
                  }}
                  style={styles.dropdownItem}
                >
                  <Text style={styles.dropdownText}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </Pressable>
      </Modal>

      <View style={styles.row}>
        <TextInput
          style={styles.searchInput}
          placeholder={`Enter ${filterType}`}
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={handleSearch}
          keyboardType={filterType === 'distance' ? 'numeric' : 'default'}
        />
        <TouchableOpacity style={styles.button} onPress={handleSearch}>
          <Text style={styles.buttonText}>Search</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SearchSection;

const styles = StyleSheet.create({
 searchWrapper: {
  marginBottom: 15,
  padding: 20,
  backgroundColor: '#fff',
  borderRadius: 10,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.1,
  shadowRadius: 6,
  elevation: 3, // same as stationCard
  marginHorizontal: 0, // Let Home.js handle margins if needed
},

  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 10,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#5bc99d',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
  },
 dropdownContainer: {
  position: 'absolute',
  top: 90,
  left: 20,
  width: screenWidth - 40,
  backgroundColor: '#fff',
  borderRadius: 10,
  elevation: 5,
  paddingVertical: 10,
  paddingHorizontal: 15,
  paddingBottom: 20, // 👈 Add this line for extra gap
},

  dropdown: {
    width: '100%',
  },
  dropdownItem: {
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderColor: '#ccc',
  },
  dropdownText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
});
