import {StatusBar, StyleSheet, useColorScheme} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import PrinterComponent from './components/PrinterComponent';
import QRScannerComponent from './components/QRScannerComponent';

const Tab = createBottomTabNavigator();

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: '#2196F3',
            tabBarInactiveTintColor: '#666',
            tabBarStyle: {
              backgroundColor: '#fff',
              borderTopWidth: 1,
              borderTopColor: '#eee',
            },
          }}>
          <Tab.Screen
            name="Scanner"
            component={QRScannerComponent}
            options={{
              tabBarLabel: 'Scan QR',
            }}
          />
          <Tab.Screen
            name="Printer"
            component={PrinterComponent}
            options={{
              tabBarLabel: 'Device Connect',
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
