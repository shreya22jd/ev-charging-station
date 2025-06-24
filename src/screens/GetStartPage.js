import { StyleSheet, Text, View, Image,TouchableOpacity } from 'react-native'
import React from 'react'
import WLCpageImg from '../../assets/img01.png'
import { button1 } from '../common/button'


const GetStartPage = ({navigation}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>EV Charging Station</Text>
      <Text style={styles.tagText}>Have fun with friends!</Text>
      <Image style={styles.image1Style} source={WLCpageImg}/>      
      <TouchableOpacity onPress={() => navigation.navigate('loginoptions')}>
        <Text style={button1}>Get Started</Text>
      </TouchableOpacity>
    </View>
  )
}

export default GetStartPage

const styles = StyleSheet.create({
    container: {
        height: "100%",
        width: "100%",
        alignItems: "center", 
        backgroundColor: '#BDF7AD'       
    },
       titleText: {
        marginTop: 60,
        color: '#2DBE7C',
        margin: '20',
        fontSize: 48,
        fontWeight: 900,
        textAlign: 'center',
        fontFamily: 'Poppins'
    },
    tagText: {
      fontSize:20,
      fontFamily:'Poppins',
      fontWeight: 'bold'
    },
    image1Style: {
      width: '100%',       
      height: 430,      
      resizeMode: 'contain',
      marginVertical: 30,
      borderRadius:10
    },
});