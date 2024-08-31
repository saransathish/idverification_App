import 'react-native-reanimated'
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View ,Button } from 'react-native';
import { useCameraDevice, useCameraPermission } from 'react-native-vision-camera';
import FrameProcessing from './components/FrameProcessing';

function App(): React.JSX.Element {
  // const device = useCameraDevice('back');

  const device = useCameraDevice('back', {
    physicalDevices: [
      'ultra-wide-angle-camera',
    ]
  })

 
  return (


<View style={{ flex: 1 }}>
      <FrameProcessing device={device}  />

</View>

  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;
