import React from 'react';
import { View, Text, StyleSheet, Platform, StatusBar } from 'react-native';

const Header = ({ title }) => {
  return (
    <View style={styles.headerContainer}>
<Text style={styles.headerText}>{String(title)}</Text>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: '#5bc99d',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 40,
    paddingBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  headerText: {
    color: 'white',
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
