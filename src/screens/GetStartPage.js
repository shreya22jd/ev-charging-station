import React, { useRef, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import img01 from '../../assets/img01.png';
import img4 from '../../assets/img01.png';
import img3 from '../../assets/img01.png';


const { width: screenWidth } = Dimensions.get('window');

const images = [img01, img4, img3];

const GetStartPage = ({ navigation }) => {
  const translateX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loopAnimation = () => {
      translateX.setValue(0);
      Animated.loop(
        Animated.timing(translateX, {
          toValue: -screenWidth * images.length,
          duration: 20000, // 20 seconds
          useNativeDriver: true,
        })
      ).start();
    };

    loopAnimation();
  }, []);

  return (
    <View style={styles.container}>
      {/* Animated horizontal image scroll */}
      <Animated.View
        style={[
          styles.animatedBackground,
          {
            transform: [{ translateX }],
          },
        ]}
      >
        {[...images, ...images].map((img, index) => (
          <Image key={index} source={img} style={styles.bgImage} resizeMode="cover" />
        ))}
      </Animated.View>

      {/* Overlay + content */}
      <LinearGradient
        colors={['rgba(0,0,0,0.5)', 'rgba(0,0,0,0.6)']}
        style={styles.overlay}
      >
        <View style={styles.content}>
          <Text style={styles.titleText}>GreenPlug</Text>
          <Text style={styles.tagText}>Charge smart. Drive clean.</Text>

          <TouchableOpacity
            onPress={() => navigation.navigate('userlogin')}
            style={styles.buttonContainer}
          >
            <Text style={styles.buttonText}>Get Started</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );
};

export default GetStartPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },
  animatedBackground: {
    position: 'absolute',
    flexDirection: 'row',
    width: screenWidth * 6, // enough width to hold images twice for seamless loop
    height: '100%',
  },
  bgImage: {
    width: screenWidth,
    height: '100%',
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  content: {
    alignItems: 'center',
  },
  titleText: {
    fontSize: 46,
    fontWeight: '900',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 15,
    fontFamily: 'Poppins',
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 4,
    letterSpacing: 1,
  },
  tagText: {
    fontSize: 20,
    color: '#E0F7FA',
    textAlign: 'center',
    marginBottom: 50,
    fontFamily: 'Poppins',
    fontWeight: '500',
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    letterSpacing: 0.5,
  },
  buttonContainer: {
    backgroundColor: '#2DBE7C',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 30,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
    fontFamily: 'Poppins',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
});
