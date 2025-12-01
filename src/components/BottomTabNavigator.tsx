import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import { Colors } from '../utils/colors';
import HomeScreen from '../screens/HomeScreen';
import PokedexListScreen from '../screens/PokedexListScreen';
import TraineeScreen from '../screens/TraineeScreen';

const Tab = createBottomTabNavigator();

// Create icon components outside of render
const HomeIcon = ({ color, size }: { color: string; size: number }) => (
  <FontAwesome6 name="house" size={size} color={color} iconStyle="solid" />
);

const PokedexIcon = ({ color, size }: { color: string; size: number }) => (
  <FontAwesome6 name="book" size={size} color={color} iconStyle="solid" />
);

const TraineeIcon = ({ color, size }: { color: string; size: number }) => (
  <FontAwesome6 name="user" size={size} color={color} iconStyle="solid" />
);

// Create screen options outside of component to avoid nested components
const homeScreenOptions = {
  title: 'Pokédex Home',
  tabBarIcon: ({ color, size }: { color: string; size: number }) => (
    <HomeIcon color={color} size={size} />
  ),
};

const pokedexScreenOptions = {
  title: 'Pokédex',
  tabBarIcon: ({ color, size }: { color: string; size: number }) => (
    <PokedexIcon color={color} size={size} />
  ),
};

const traineeScreenOptions = {
  title: 'Trainer Profile',
  tabBarIcon: ({ color, size }: { color: string; size: number }) => (
    <TraineeIcon color={color} size={size} />
  ),
};

const BottomTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textLight,
        tabBarStyle: {
          backgroundColor: Colors.background,
          borderTopColor: Colors.border,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        headerStyle: {
          backgroundColor: Colors.primary,
        },
        headerTintColor: Colors.textInverse,
        headerTitleStyle: {
          fontWeight: 'bold' as const,
          fontSize: 20,
        },
        headerTitleAlign: 'center' as const,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500' as const,
        },
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={homeScreenOptions}
      />
      <Tab.Screen 
        name="Pokedex" 
        component={PokedexListScreen}
        options={pokedexScreenOptions}
      />
      <Tab.Screen 
        name="Trainee" 
        component={TraineeScreen}
        options={traineeScreenOptions}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;