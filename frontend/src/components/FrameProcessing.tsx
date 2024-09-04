import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View, Animated, useWindowDimensions } from 'react-native';
import { Camera, runAsync, useCameraDevice, useCameraFormat, useFrameProcessor, useSkiaFrameProcessor } from 'react-native-vision-camera';
import { Worklets } from 'react-native-worklets-core';
import axios from 'axios';
import { detect } from './Callplugin';
import LoadingView from './LoadingView';

interface Frames {
  bottom: number;
  left: number;
  right: number;
  top: number;
}

interface Detected {
  boundingBox: Frames;
  confidence: number;
  label: string;
}

const imageWidth = 300;
const imageHeight = 300;

const FrameProcessing: React.FC = () => {
  
  const device = useCameraDevice('front', {
    physicalDevices: [
      'ultra-wide-angle-camera',
    ]
  });
  if (!device) return <LoadingView />;

  const [objects, setObjects] = useState<Detected[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const opacity = useRef(new Animated.Value(0)).current;
  const cameraRef = useRef<Camera>(null);

  const format = useCameraFormat(device, [
    { videoResolution: { width: imageWidth, height: imageHeight } },
    { fps: 15 }
  ]);

  const onDetected = Worklets.createRunOnJS((detectedObjects: Detected[]) => {
    setObjects(detectedObjects);
  });

  const frameProcessor = useFrameProcessor((frame) => {
    'worklet';

    runAsync(frame, () => {
      'worklet';
      const values: Detected[] = detect(frame) as [];
      onDetected(values);
      console.log(values);

    });
  }, [onDetected]);

  useEffect(() => {
    const interval = setInterval(async () => {
      if (cameraRef.current) {
        try {
          const photo = await cameraRef.current.takePhoto();
          const data = new FormData();
          data.append('image', {
            uri: `file://${photo.path}`,
            name: 'image.jpg',
            type: 'image/jpg',
          });

          const response = await axios.post('http://192.168.0.158:8000/upload/', data, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });

          setToastMessage(response.data.message); // Set toast message
          showToast(); // Show the toast message

        } catch (error) {
          console.error('Failed to take snapshot:', error);
        }
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const showToast = () => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setTimeout(() => {
        Animated.timing(opacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => setToastMessage(null));
      }, 3000); // Hide toast after 3 seconds
    });
  };

  return (
    <View style={{ flex: 1 }}>
      <Camera
        style={{ flex: 1 }}
        device={device}
        isActive={true}
        photo={true}
        ref={cameraRef}
        frameProcessor={frameProcessor}
        pixelFormat="yuv"
      />

      {objects.map(({ boundingBox, label, confidence }, index) => {
        const { top, left, right, bottom } = boundingBox

        return (
          <View
            key={index}
            style={[
              styles.detectionFrame,
              {
                top: top ,
                left: left,
                width: right - left,
                height: bottom - top  ,
              },
            ]}
          >
            <View style={styles.detectionFrameLabel}>
              <Text style={styles.labelText}>{`${label} (${(confidence * 100).toFixed(2)}%)`}</Text>
            </View>
          </View>
        );
      })}

      {toastMessage && (
        <Animated.View style={[styles.toast, { opacity }]}>
          <Text style={styles.toastText}>{toastMessage}</Text>
        </Animated.View>
      )}
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
  toast: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    right: 20,
    padding: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 5,
    zIndex: 10,
  },
  toastText: {
    color: '#fff',
    textAlign: 'center',
  },
});

export default FrameProcessing;


