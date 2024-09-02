// import React, { useEffect, useRef, useState } from 'react';
// import { StyleSheet, Text, View } from 'react-native';
// import { Camera, runAsync, useCameraDevice, useCameraFormat, useFrameProcessor } from 'react-native-vision-camera';
// import { Worklets } from 'react-native-worklets-core';
// import axios from 'axios';
// import { detect } from './Callplugin';
// import LoadingView from './LoadingView';



// interface Frames {
//   bottom: number;
//   left: number;
//   right: number;
//   top: number;
// }

// interface Detected {
//   boundingBox: Frames;
//   confidence: number;
//   label: string;
// }

// const imageWidth = 300;
// const imageHeight = 300;

// const FrameProcessing: React.FC = () => {
  
//     const device = useCameraDevice('back', {
//     physicalDevices: [
//       'ultra-wide-angle-camera',
//     ]
//   })
//   if (!device) return <LoadingView />; 

//   const [objects, setObjects] = useState<Detected[]>([]);
//   const cameraRef = useRef<Camera>(null); 

//   const format = useCameraFormat(device, [
//     { videoResolution: { width: imageWidth, height: imageHeight } },
//     { fps: 15 }
//   ]);

//   const onDetected = Worklets.createRunOnJS((detectedObjects: Detected[]) => {
//     setObjects(detectedObjects);
//   });

//   const frameProcessor = useFrameProcessor((frame) => {
//     'worklet';

//     runAsync(frame, () => {
//       'worklet';
//       const values: Detected[] = detect(frame) as [];
//       // console.log(values);
//       onDetected(values);
//     });
//   }, [onDetected]);

//   useEffect(() => {
//     const interval = setInterval(async () => {
//       if (cameraRef.current) {
//         try {
//           const photo = await cameraRef.current.takePhoto(); // Removed skipMetadata
//           const data = new FormData();
//           data.append('image', {
//             uri: `file://${photo.path}`,
//             name: 'image.jpg',
//             type: 'image/jpg',
//           });

//           const response = await axios.post('http://192.168.0.158:8000/upload/', data, {
//             headers: {
//               'Content-Type': 'multipart/form-data',
//             },
//           });
//           console.log('Response from server:', response.data.message);

//         } catch (error) {
//           console.error('Failed to take snapshot:', error);
//         }
//       }
//     }, 1000);

//     return () => clearInterval(interval); // Clear the interval when the component unmounts
//   }, []);

//   return (
//     <View style={{flex:1}}>
//       <Camera
//         style={{ flex: 1   }}
//         device={device}
//         isActive={true}
//         photo={true}
//         ref={cameraRef} 
//         frameProcessor={frameProcessor}
//         pixelFormat="yuv"
//         // format={format}
//       />

//       {objects.map(({ boundingBox, label, confidence }, index) => {
//         const { top, left, right, bottom } = boundingBox;

//         return (
//           <View
//             key={index}
//             style={[
//               styles.detectionFrame,
//               {
//                 top: top,
//                 left: left,
//                 width: right - left,
//                 height: bottom - top,
//               },
//             ]}
//           >
//             <View style={styles.detectionFrameLabel}>
//               <Text style={styles.labelText}>{`${label} (${(confidence * 100).toFixed(2)}%)`}</Text>
//             </View>
//           </View>
//         );
//       })}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   detectionFrame: {
//     position: 'absolute',
//     borderWidth: 6,
//     borderColor: '#00ff00',
//     zIndex: 9,
//   },
//   detectionFrameLabel: {
//     position: 'absolute',
//     backgroundColor: 'rgba(0, 255, 0, 0.5)',
//     padding: 2,
//     borderRadius: 3,
//     top: 0,
//     left: 0,
//   },
//   labelText: {
//     color: '#fff',
//     fontSize: 12,
//   },
// });

// export default FrameProcessing;
 

// import React, { useEffect, useRef, useState } from 'react';
// import { StyleSheet, Text, View, Animated } from 'react-native';
// import { Camera, runAsync, useCameraDevice, useCameraFormat, useFrameProcessor } from 'react-native-vision-camera';
// import { Worklets } from 'react-native-worklets-core';
// import axios from 'axios';
// import { detect } from './Callplugin';
// import LoadingView from './LoadingView';

// interface Frames {
//   bottom: number;
//   left: number;
//   right: number;
//   top: number;
// }

// interface Detected {
//   boundingBox: Frames;
//   confidence: number;
//   label: string;
// }

// const imageWidth = 300;
// const imageHeight = 300;

// const FrameProcessing: React.FC = () => {
  
//   const device = useCameraDevice('front', {
//     physicalDevices: [
//       'ultra-wide-angle-camera',
//     ]
//   });
//   if (!device) return <LoadingView />;

//   const [objects, setObjects] = useState<Detected[]>([]);
//   const [toastMessage, setToastMessage] = useState<string | null>(null); // State for toast message
//   const opacity = useRef(new Animated.Value(0)).current; // Opacity for fade-in/fade-out animation
//   const cameraRef = useRef<Camera>(null);

//   const format = useCameraFormat(device, [
//     { videoResolution: { width: imageWidth, height: imageHeight } },
//     { fps: 15 }
//   ]);

//   const onDetected = Worklets.createRunOnJS((detectedObjects: Detected[]) => {
//     setObjects(detectedObjects);
//   });

//   const frameProcessor = useFrameProcessor((frame) => {
//     'worklet';

//     runAsync(frame, () => {
//       'worklet';
//       const values: Detected[] = detect(frame) as [];
//       onDetected(values);
//     });
//   }, [onDetected]);

//   useEffect(() => {
//     const interval = setInterval(async () => {
//       if (cameraRef.current) {
//         try {
//           const photo = await cameraRef.current.takePhoto();
//           const data = new FormData();
//           data.append('image', {
//             uri: `file://${photo.path}`,
//             name: 'image.jpg',
//             type: 'image/jpg',
//           });

//           const response = await axios.post('http://192.168.0.158:8000/upload/', data, {
//             headers: {
//               'Content-Type': 'multipart/form-data',
//             },
//           });

//           setToastMessage(response.data.message); // Set toast message
//           showToast(); // Show the toast message

//         } catch (error) {
//           console.error('Failed to take snapshot:', error);
//         }
//       }
//     }, 5000);

//     return () => clearInterval(interval);
//   }, []);

//   const showToast = () => {
//     Animated.timing(opacity, {
//       toValue: 1,
//       duration: 300,
//       useNativeDriver: true,
//     }).start(() => {
//       setTimeout(() => {
//         Animated.timing(opacity, {
//           toValue: 0,
//           duration: 300,
//           useNativeDriver: true,
//         }).start(() => setToastMessage(null));
//       }, 3000); // Hide toast after 3 seconds
//     });
//   };

//   return (
//     <View style={{ flex: 1 }}>
//       <Camera
//         style={{ flex: 1 }}
//         device={device}
//         isActive={true}
//         photo={true}
//         ref={cameraRef}
//         frameProcessor={frameProcessor}
//         pixelFormat="yuv"
//       />

//       {objects.map(({ boundingBox, label, confidence }, index) => {
//         const { top, left, right, bottom } = boundingBox;

//         return (
//           <View
//             key={index}
//             style={[
//               styles.detectionFrame,
//               {
//                 top: top,
//                 left: left,
//                 width: right - left,
//                 height: bottom - top,
//               },
//             ]}
//           >
//             <View style={styles.detectionFrameLabel}>
//               <Text style={styles.labelText}>{`${label} (${(confidence * 100).toFixed(2)}%)`}</Text>
//             </View>
//           </View>
//         );
//       })}

//       {toastMessage && (
//         <Animated.View style={[styles.toast, { opacity }]}>
//           <Text style={styles.toastText}>{toastMessage}</Text>
//         </Animated.View>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   detectionFrame: {
//     position: 'absolute',
//     borderWidth: 6,
//     borderColor: '#00ff00',
//     zIndex: 9,
//   },
//   detectionFrameLabel: {
//     position: 'absolute',
//     backgroundColor: 'rgba(0, 255, 0, 0.5)',
//     padding: 2,
//     borderRadius: 3,
//     top: 0,
//     left: 0,
//   },
//   labelText: {
//     color: '#fff',
//     fontSize: 12,
//   },
//   toast: {
//     position: 'absolute',
//     bottom: 40,
//     left: 20,
//     right: 20,
//     padding: 10,
//     backgroundColor: 'rgba(0, 0, 0, 0.7)',
//     borderRadius: 5,
//     zIndex: 10,
//   },
//   toastText: {
//     color: '#fff',
//     textAlign: 'center',
//   },
// });

// export default FrameProcessing;


import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View, Animated, Modal, ActivityIndicator } from 'react-native';
import { Camera, runAsync, useCameraDevice, useCameraFormat, useFrameProcessor } from 'react-native-vision-camera';
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

const FrameProcessing: React.FC<{ onVerified: () => void }> = ({ onVerified }) => {
  
  const device = useCameraDevice('front', {
    physicalDevices: [
      'ultra-wide-angle-camera',
    ]
  });
  if (!device) return <LoadingView />;

  const [objects, setObjects] = useState<Detected[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [showLoading, setShowLoading] = useState<boolean>(false); // State for showing loading popup
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

          if (response.data.message === "YES") {
            setShowLoading(true);
            setTimeout(() => {
              setShowLoading(false);
              setToastMessage("Verified");
              showToast();
              setTimeout(() => {
                setIsVerified(true);
              }, 3000);
            }, 5000);
          } else {
            setToastMessage(response.data.message);
            showToast();
          }

        } catch (error) {
          console.error('Failed to take snapshot:', error);
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isVerified) {
      onVerified(); // Close the camera component and return to the main page
    }
  }, [isVerified]);

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
      }, 3000);
    });
  };

  const drawCornerCuts = (boundingBox: Frames) => {
    const { top, left, right, bottom } = boundingBox;
    const cornerSize = 20;

    return (
      <>
        {/* Top-left corner */}
        <View style={[styles.corner, { top: top, left: left, width: cornerSize, height: 5 }]} />
        <View style={[styles.corner, { top: top, left: left, width: 5, height: cornerSize }]} />

        {/* Top-right corner */}
        <View style={[styles.corner, { top: top, left: right - cornerSize, width: cornerSize, height: 5 }]} />
        <View style={[styles.corner, { top: top, left: right - 5, width: 5, height: cornerSize }]} />

        {/* Bottom-left corner */}
        <View style={[styles.corner, { top: bottom - 5, left: left, width: cornerSize, height: 5 }]} />
        <View style={[styles.corner, { top: bottom - cornerSize, left: left, width: 5, height: cornerSize }]} />

        {/* Bottom-right corner */}
        <View style={[styles.corner, { top: bottom - 5, left: right - cornerSize, width: cornerSize, height: 5 }]} />
        <View style={[styles.corner, { top: bottom - cornerSize, left: right - 5, width: 5, height: cornerSize }]} />
      </>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <Camera
        style={{ flex: 1 }}
        device={device}
        isActive={!isVerified}
        photo={true}
        ref={cameraRef}
        frameProcessor={frameProcessor}
        pixelFormat="yuv"
      />

      {objects.map(({ boundingBox, label }, index) => {
        return label === "person" ? (
          <View key={index}>
            {drawCornerCuts(boundingBox)}
          </View>
        ) : (
          <View
            key={index}
            style={[
              styles.detectionFrame,
              {
                top: boundingBox.top,
                left: boundingBox.left,
                width: boundingBox.right - boundingBox.left,
                height: boundingBox.bottom - boundingBox.top,
              },
            ]}
          >
            <View style={styles.detectionFrameLabel}>
              <Text style={styles.labelText}>{label}</Text>
            </View>
          </View>
        );
      })}

      {toastMessage && (
        <Animated.View style={[styles.toast, { opacity }]}>
          <Text style={styles.toastText}>{toastMessage}</Text>
        </Animated.View>
      )}

      {showLoading && (
        <Modal transparent={true} animationType="fade">
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#00ff00" />
            <Text style={styles.loadingText}>Loading...</Text>
          </View>
        </Modal>
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
    bottom: 40,
    left: 20,
    right: 20,
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 5,
    zIndex: 10,
  },
  toastText: {
    color: '#fff',
    textAlign: 'center',
  },
  loadingOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  loadingText: {
    marginTop: 10,
    color: '#fff',
    fontSize: 18,
  },
  corner: {
    position: 'absolute',
    backgroundColor: '#00ff00',
  },
});

export default FrameProcessing;
