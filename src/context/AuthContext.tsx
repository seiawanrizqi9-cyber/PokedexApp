import React, { createContext, useState, useContext, ReactNode } from 'react';

export interface Trainer {
  id: string;
  name: string;
  level: number;
  pokemonCaught: number;
  pokedexCompletion: number;
  region: string;
  badges: number;
  joinDate: string;
}

interface AuthContextType {
  trainer: Trainer | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo accounts data
const demoAccounts = [
  {
    id: '1',
    username: 'ash ketchum',
    password: 'pikachu123',
    name: 'Ash Ketchum',
    region: 'Kanto',
    badges: 8,
    pokemonCaught: 42,
    joinDate: '2024-01-15'
  },
  {
    id: '2',
    username: 'misty',
    password: 'starmie123',
    name: 'Misty',
    region: 'Kanto',
    badges: 0,
    pokemonCaught: 15,
    joinDate: '2024-02-20'
  },
  {
    id: '3',
    username: 'brock',
    password: 'onix123',
    name: 'Brock',
    region: 'Kanto',
    badges: 0,
    pokemonCaught: 22,
    joinDate: '2024-03-10'
  }
];

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [trainer, setTrainer] = useState<Trainer | null>(null);

  const calculateTrainerLevel = (pokemonCaught: number, badges: number): number => {
    const baseLevel = Math.floor(pokemonCaught / 5) + (badges * 2);
    return Math.min(baseLevel, 50); // Cap at level 50
  };

  const calculatePokedexCompletion = (pokemonCaught: number): number => {
    const totalPokemon = 1008; // Total Pokémon available
    const completion = Math.round((pokemonCaught / totalPokemon) * 100);
    return Math.min(completion, 100);
  };

  const login = async (username: string, password: string): Promise<boolean> => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        // Check if credentials match any demo account
        const matchedAccount = demoAccounts.find(
          account => 
            account.username.toLowerCase() === username.toLowerCase() && 
            account.password === password
        );

        if (matchedAccount) {
          const newTrainer: Trainer = {
            id: matchedAccount.id,
            name: matchedAccount.name,
            level: calculateTrainerLevel(matchedAccount.pokemonCaught, matchedAccount.badges),
            pokemonCaught: matchedAccount.pokemonCaught,
            pokedexCompletion: calculatePokedexCompletion(matchedAccount.pokemonCaught),
            region: matchedAccount.region,
            badges: matchedAccount.badges,
            joinDate: matchedAccount.joinDate,
          };
          setTrainer(newTrainer);
          resolve(true);
        } else {
          resolve(false);
        }
      }, 1500);
    });
  };

  const logout = () => {
    setTrainer(null);
  };

  return (
    <AuthContext.Provider value={{
      trainer,
      login,
      logout,
      isAuthenticated: !!trainer,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};