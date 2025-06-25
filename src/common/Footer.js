import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const Footer = ({ navigation }) => {
  return (
    <View style={styles.footer}>
      <TouchableOpacity onPress={() => navigation.navigate('home')} style={styles.footerItem}>
        <Icon name="home" size={24} color="#5bc99d" />
        <Text style={styles.footerText}>Home</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('History')} style={styles.footerItem}>
        <Icon name="history" size={24} color="#5bc99d" />
        <Text style={styles.footerText}>History</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Profile')} style={styles.footerItem}>
        <Icon name="user" size={24} color="#5bc99d" />
        <Text style={styles.footerText}>Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    elevation: 8,
  },
  footerItem: {
    alignItems: 'center',
    flex: 1,
  },
  footerText: {
    fontSize: 16,
    color: '#333',
  },
});

export default Footer;
