import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BottomTabNavigator from '../components/BottomTabNavigator';
import PokemonDetailScreen from '../screens/PokemonDetailScreen';
import LoginScreen from '../screens/LoginScreen';

export type RootStackParamList = {
  MainTabs: undefined;
  PokemonDetail: { pokemonId: number };
  Login: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#DC0A2D',
        },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="MainTabs" 
        component={BottomTabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="PokemonDetail" 
        component={PokemonDetailScreen}
        options={{ 
          title: 'Pokémon Details',
          headerBackTitle: 'Back',
        }}
      />
      <Stack.Screen 
        name="Login" 
        component={LoginScreen}
        options={{ 
          title: 'Trainer Login',
          headerBackTitle: 'Back',
        }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;