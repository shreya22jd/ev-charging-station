import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import userImg from '../../assets/userIcon.png';
import serProvImg from '../../assets/serviceProviderIcon.png';

const LoginOptions = ({navigation}) => {
  return (
    <View style={styles.container}>
      
      <TouchableOpacity style={styles.optionBox} onPress={() => navigation.navigate('userlogin')}>
        <Image style={styles.userImg} source={userImg} />
        <Text style={styles.optionText}>User</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.optionBox} onPress={() => navigation.navigate('userlogin')}>
        <Image style={styles.userImg} source={serProvImg} />
        <Text style={styles.optionText}>Service Provider</Text>
      </TouchableOpacity>

    </View>
  );
};

export default LoginOptions;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 50,
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  optionBox: {
    height: 250,
    width: 250,
    borderWidth: 3,
    borderColor: '#5bc99d',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    elevation: 5, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
  },
  userImg: {
    width: 100,
    height: 100,
    marginBottom: 20,
    resizeMode: 'contain',
  },
  optionText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#5bc99d',
    fontFamily: 'Poppins',
  },
});
