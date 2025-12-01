import axios from 'axios';

const BASE_URL = 'https://pokeapi.co/api/v2';

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000, // Increase timeout to 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for better error handling
api.interceptors.request.use(
  (config) => {
    console.log(`Making API request to: ${config.url}`);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Response Error:', error);
    if (error.code === 'ECONNABORTED') {
      error.message = 'Request timeout - Please check your internet connection';
    } else if (error.message === 'Network Error') {
      error.message = 'Network error - Please check your internet connection';
    }
    return Promise.reject(error);
  }
);

export const pokemonService = {
  getPokemonList: (offset: number = 0, limit: number = 20) => 
    api.get(`/pokemon?offset=${offset}&limit=${limit}`),
  
  getPokemonDetail: (idOrName: string | number) => 
    api.get(`/pokemon/${idOrName}`),
};