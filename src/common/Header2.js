import React from 'react';
import { View, Text, StyleSheet, Platform, StatusBar } from 'react-native';

const Header2 = ({ title }) => {
  return (
    <View style={styles.headerContainer}>
      <Text style={styles.headerText}>{title}</Text>
    </View>
  );
};

export default Header2;

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: '#5bc99d',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 20,
    paddingBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
    width: 500,
    top:-60,
    left: -60,
    
  },
  headerText: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
  },
});
