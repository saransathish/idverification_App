// src/screens/HomeScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import image from './images/image1.jpeg'
import { useCameraDevice } from 'react-native-vision-camera';
import { useCameraPermission } from './useCameraPermission';
import LoadingView from './LoadingView';
import PermissionDenied from './PermisionDenied';
const HomeScreen: React.FC = () => {
  const navigation = useNavigation();
  const { pending, isPermissionGranted } = useCameraPermission();
 
  if ( pending) return <LoadingView />;
  if (!isPermissionGranted) return <PermissionDenied />;

  const handleVerify = () => {
    navigation.navigate('Camera');
  };

  return (
    <ImageBackground
      source={image}
      style={styles.background}
    >
      <View style={styles.container}>
        <TouchableOpacity style={styles.button} onPress={handleVerify}>
          <Text style={styles.buttonText}>Verify</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#2196F3',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default HomeScreen;
