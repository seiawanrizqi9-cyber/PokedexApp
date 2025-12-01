export const Colors = {
  // Primary Colors (Pokédex Theme)
  primary: '#DC0A2D', 
  primaryDark: '#B80624', 
  primaryLight: '#FF3B5C',
  
  // Secondary Colors
  secondary: '#2A75BB', 
  secondaryDark: '#1E5A9A',
  secondaryLight: '#4A90E2',
  
  // Background Colors
  background: '#FFFFFF',
  backgroundDark: '#0A0A0A',
  surface: '#F5F5F5',
  surfaceDark: '#1A1A1A',
  
  // Text Colors
  text: '#1A1A1A',
  textLight: '#666666',
  textDark: '#FFFFFF',
  textInverse: '#FFFFFF',
  
  // Status Colors
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#F44336',
  info: '#2196F3',
  
  // Pokemon Type Colors
  type: {
    normal: '#A8A878',
    fire: '#F08030',
    water: '#6890F0',
    electric: '#F8D030',
    grass: '#78C850',
    ice: '#98D8D8',
    fighting: '#C03028',
    poison: '#A040A0',
    ground: '#E0C068',
    flying: '#A890F0',
    psychic: '#F85888',
    bug: '#A8B820',
    rock: '#B8A038',
    ghost: '#705898',
    dragon: '#7038F8',
    dark: '#705848',
    steel: '#B8B8D0',
    fairy: '#EE99AC',
  },
  
  // Grayscale
  gray: {
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#EEEEEE',
    300: '#E0E0E0',
    400: '#BDBDBD',
    500: '#9E9E9E',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121',
  },
  
  // Border
  border: '#E0E0E0',
  borderDark: '#333333',
  
  // Shadow
  shadow: 'rgba(0, 0, 0, 0.1)',
  shadowDark: 'rgba(0, 0, 0, 0.3)',
};

export type ColorType = keyof typeof Colors;
export type PokemonType = keyof typeof Colors.type;