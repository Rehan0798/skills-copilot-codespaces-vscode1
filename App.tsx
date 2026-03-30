/**
 * PDF Reader App
 * Root component — sets up navigation
 */

import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {SafeAreaProvider} from 'react-native-safe-area-context';

import HomeScreen from './src/screens/HomeScreen';
import PdfViewerScreen from './src/screens/PdfViewerScreen';

const Stack = createNativeStackNavigator();

function App(): React.JSX.Element {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{title: 'PDF Reader'}}
          />
          <Stack.Screen
            name="PdfViewer"
            component={PdfViewerScreen}
            options={({route}) => ({
              title: (route.params as {fileName?: string}).fileName ?? 'PDF Viewer',
            })}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default App;
