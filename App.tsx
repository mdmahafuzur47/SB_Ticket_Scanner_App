import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import PrinterComponent from './components/PrinterComponent';
import QRScanner from './components/QRScanner';

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
          }}
        >
          <Tab.Screen
            name="Scanner"
            component={QRScanner}
            options={{
              tabBarLabel: 'Scan QR',
              tabBarIcon: ({ color, size }) => (
                <Icon name="qr-code-scanner" size={size} color={color} />
              ),
            }}
          />
          <Tab.Screen
            name="Printer"
            component={PrinterComponent}
            options={{
              tabBarLabel: 'Device Connect',
              tabBarIcon: ({ color, size }) => (
                <Icon name="bluetooth" size={size} color={color} />
              ),
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}


export default App;
