export type RootStackParamList = {
  Login: undefined;
  MainTabs: undefined;
  PokemonDetail: { pokemonId: number };
};

export type MainTabParamList = {
  Home: undefined;
  Pokedex: undefined;
  Trainee: undefined;
};

export type PokedexTopTabParamList = {
  All: { type: null };
  Fire: { type: 'fire' };
  Water: { type: 'water' };
  Grass: { type: 'grass' };
  Electric: { type: 'electric' };
  Ice: { type: 'ice' };
  Fighting: { type: 'fighting' };
  Poison: { type: 'poison' };
  Ground: { type: 'ground' };
  Flying: { type: 'flying' };
  Psychic: { type: 'psychic' };
  Bug: { type: 'bug' };
  Rock: { type: 'rock' };
  Ghost: { type: 'ghost' };
  Dragon: { type: 'dragon' };
  Dark: { type: 'dark' };
  Steel: { type: 'steel' };
  Fairy: { type: 'fairy' };
};