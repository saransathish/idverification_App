import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Camera, runAsync, useCameraFormat, useFrameProcessor } from 'react-native-vision-camera';

interface FrameProcessingProps {
  device: any;
}

const imageWidth = 300;
const imageHeight = 300;

const FrameProcessing: React.FC<FrameProcessingProps> = ({ device }) => {

  // const format = useCameraFormat(device, [
  //   { videoResolution: { width: imageWidth, height: imageHeight } },
  //   { fps: 15 }
  // ]);

 
  const frameProcessor = useFrameProcessor((frame) => {
    'worklet';

    runAsync(frame, () => {
      'worklet';
      console.log('values');
    });
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <Camera
        style={{ flex: 1 }}
        device={device}
        isActive={true}
        photo={true}
        frameProcessor={frameProcessor}
        pixelFormat="yuv"
        // format={format}
      />

      
    </View>
  );
};

const styles = StyleSheet.create({
  detectionFrame: {
    position: 'absolute',
    borderWidth: 6,
    borderColor: '#00ff00',
    zIndex: 9,
  },
  detectionFrameLabel: {
    position: 'absolute',
    backgroundColor: 'rgba(0, 255, 0, 0.5)',
    padding: 2,
    borderRadius: 3,
    top: 0,
    left: 0,
  },
  labelText: {
    color: '#fff',
    fontSize: 12,
  },
});

export default FrameProcessing;
 