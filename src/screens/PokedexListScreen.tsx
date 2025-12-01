import React, { useState, useEffect, useCallback, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Image,
  Dimensions,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { RouteProp } from '@react-navigation/native';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import { Colors } from '../utils/colors';
import { pokemonService } from '../services/api';
import { Pokemon, PokemonListItem } from '../types/pokemon';
import {
  RootStackParamList,
  PokedexTopTabParamList,
} from '../navigation/types';

type PokedexListScreenNavigationProp = StackNavigationProp<RootStackParamList>;
const TopTab = createMaterialTopTabNavigator<PokedexTopTabParamList>();
type PokemonTabProps = {
  route: RouteProp<PokedexTopTabParamList, keyof PokedexTopTabParamList>;
};

const { width } = Dimensions.get('window');
const CARD_MARGIN = 8;
const CARD_WIDTH = (width - CARD_MARGIN * 3) / 2;
const POKEMON_PER_PAGE = 50;

interface PokemonDataContextType {
  allPokemon: Pokemon[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

const PokemonDataContext = React.createContext<PokemonDataContextType>({
  allPokemon: [],
  loading: false,
  error: null,
  refetch: () => {},
});

const PokemonDataProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [allPokemon, setAllPokemon] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAllPokemon = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const allPokemonResponse = await pokemonService.getPokemonList(0, 1000);
      const allPokemonNames: PokemonListItem[] =
        allPokemonResponse.data.results;
      const pokemonDetails: Pokemon[] = [];

      for (const item of allPokemonNames) {
        try {
          const detailResponse = await pokemonService.getPokemonDetail(
            item.name,
          );
          pokemonDetails.push(detailResponse.data);
        } catch (detailErr) {
          console.warn(`Failed to load details for ${item.name}`);
        }
      }
      setAllPokemon(pokemonDetails);
    } catch (err: any) {
      setError(err.message || 'Failed to load Pokémon data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAllPokemon();
  }, [loadAllPokemon]);
  return (
    <PokemonDataContext.Provider
      value={{ allPokemon, loading, error, refetch: loadAllPokemon }}
    >
      {children}
    </PokemonDataContext.Provider>
  );
};

// Pagination hanya untuk All tab
const usePokemonPagination = (pokemonList: Pokemon[]) => {
  const [currentPage, setCurrentPage] = useState(1);

  const getCurrentPageData = () => {
    const startIndex = (currentPage - 1) * POKEMON_PER_PAGE;
    const endIndex = startIndex + POKEMON_PER_PAGE;
    return pokemonList.slice(startIndex, endIndex);
  };

  const getTotalPages = () => Math.ceil(pokemonList.length / POKEMON_PER_PAGE);

  const goToNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, getTotalPages()));
  };

  const goToPrevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  return {
    currentPage,
    currentPageData: getCurrentPageData(),
    totalPages: getTotalPages(),
    goToNextPage,
    goToPrevPage,
  };
};

const PokemonCard: React.FC<{
  pokemon: Pokemon;
  onPress: (pokemonId: number) => void;
}> = ({ pokemon, onPress }) => {
  const imageUrl =
    pokemon.sprites.other?.['official-artwork']?.front_default ||
    pokemon.sprites.front_default;
  const mainType = pokemon.types[0]?.type.name || 'normal';
  const typeColor =
    Colors.type[mainType as keyof typeof Colors.type] || Colors.gray[500];

  return (
    <TouchableOpacity
      style={[styles.pokemonCard, { backgroundColor: typeColor + '15' }]}
      onPress={() => onPress(pokemon.id)}
      activeOpacity={0.8}
    >
      {/* Background Pattern */}
      <View
        style={[styles.cardBackground, { backgroundColor: typeColor + '10' }]}
      />

      {/* Header dengan ID dan Type Badges */}
      <View style={styles.cardHeader}>
        <Text style={styles.pokemonId}>
          #{pokemon.id.toString().padStart(3, '0')}
        </Text>
        <View style={styles.typeContainer}>
          {pokemon.types.map((typeInfo, index) => (
            <View
              key={index}
              style={[
                styles.typeBadge,
                {
                  backgroundColor:
                    Colors.type[
                      typeInfo.type.name as keyof typeof Colors.type
                    ] || Colors.gray[500],
                },
              ]}
            >
              <Text style={styles.typeText}>
                {typeInfo.type.name.charAt(0).toUpperCase()}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Pokemon Image */}
      <View style={styles.imageContainer}>
        {imageUrl ? (
          <Image
            source={{ uri: imageUrl }}
            style={styles.pokemonImage}
            resizeMode="contain"
          />
        ) : (
          <View style={styles.imagePlaceholder}>
            <FontAwesome6
              name="question"
              size={24}
              color={Colors.gray[400]}
              iconStyle="solid"
            />
          </View>
        )}

        {/* Decorative Pokéball */}
        <View style={styles.pokeballDecoration}>
          <FontAwesome6
            name="circle"
            size={60}
            color={typeColor + '20'}
            iconStyle="solid"
          />
          <View
            style={[styles.pokeballLine, { backgroundColor: typeColor + '30' }]}
          />
        </View>
      </View>

      {/* Pokemon Name */}
      <View style={styles.nameContainer}>
        <Text style={styles.pokemonName}>
          {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
        </Text>

        {/* Stats Indicator */}
        <View style={styles.statsIndicator}>
          <View style={styles.statDot} />
          <View style={styles.statDot} />
          <View style={styles.statDot} />
        </View>
      </View>

      {/* Type Labels */}
      <View style={styles.typeLabels}>
        {pokemon.types.map((typeInfo, index) => (
          <View
            key={index}
            style={[
              styles.typeLabel,
              {
                backgroundColor:
                  Colors.type[typeInfo.type.name as keyof typeof Colors.type] ||
                  Colors.gray[500],
              },
            ]}
          >
            <Text style={styles.typeLabelText}>
              {typeInfo.type.name.toUpperCase()}
            </Text>
          </View>
        ))}
      </View>
    </TouchableOpacity>
  );
};

const PaginationControls: React.FC<{
  currentPage: number;
  totalPages: number;
  onNext: () => void;
  onPrev: () => void;
}> = ({ currentPage, totalPages, onNext, onPrev }) => {
  if (totalPages <= 1) return null;
  return (
    <View style={styles.paginationContainer}>
      <TouchableOpacity
        style={[
          styles.paginationButton,
          currentPage === 1 && styles.paginationButtonDisabled,
        ]}
        onPress={onPrev}
        disabled={currentPage === 1}
      >
        <FontAwesome6
          name="chevron-left"
          size={16}
          color={Colors.textInverse}
          iconStyle="solid"
        />
        <Text style={styles.paginationButtonText}>Prev</Text>
      </TouchableOpacity>
      <Text style={styles.paginationText}>
        Page {currentPage} of {totalPages}
      </Text>
      <TouchableOpacity
        style={[
          styles.paginationButton,
          currentPage === totalPages && styles.paginationButtonDisabled,
        ]}
        onPress={onNext}
        disabled={currentPage === totalPages}
      >
        <Text style={styles.paginationButtonText}>Next</Text>
        <FontAwesome6
          name="chevron-right"
          size={16}
          color={Colors.textInverse}
          iconStyle="solid"
        />
      </TouchableOpacity>
    </View>
  );
};

const createTypeTab = (typeName: string) => {
  return ({
    navigation,
  }: PokemonTabProps & { navigation: PokedexListScreenNavigationProp }) => {
    const { allPokemon, loading } = useContext(PokemonDataContext);
    const typePokemon = allPokemon.filter(pokemon =>
      pokemon.types.some(type => type.type.name === typeName.toLowerCase()),
    );
    const handlePokemonPress = (pokemonId: number) =>
      navigation.navigate('PokemonDetail', { pokemonId });

    if (loading && allPokemon.length === 0) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading Pokémon...</Text>
        </View>
      );
    }

    if (typePokemon.length === 0) {
      return (
        <View style={styles.centerContainer}>
          <FontAwesome6
            name="magnifying-glass"
            size={48}
            color={Colors.textLight}
            iconStyle="solid"
          />
          <Text>No {typeName} type Pokémon found</Text>
        </View>
      );
    }

    return (
      <View style={styles.tabContainer}>
        <FlatList
          data={typePokemon}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <PokemonCard pokemon={item} onPress={handlePokemonPress} />
          )}
          numColumns={2}
          contentContainerStyle={styles.listContent}
          columnWrapperStyle={styles.columnWrapper}
          showsVerticalScrollIndicator={false}
        />
      </View>
    );
  };
};

const AllPokemonTab: React.FC<
  PokemonTabProps & { navigation: PokedexListScreenNavigationProp }
> = ({ navigation }) => {
  const { allPokemon, loading, error, refetch } =
    useContext(PokemonDataContext);
  const {
    currentPage,
    currentPageData,
    totalPages,
    goToNextPage,
    goToPrevPage,
  } = usePokemonPagination(allPokemon);
  const handlePokemonPress = (pokemonId: number) =>
    navigation.navigate('PokemonDetail', { pokemonId });

  if (loading)
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Loading Pokémon...</Text>
      </View>
    );
  if (error)
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorTitle}>Oops!</Text>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={refetch}>
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );

  return (
    <View style={styles.tabContainer}>
      <FlatList
        data={currentPageData}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <PokemonCard pokemon={item} onPress={handlePokemonPress} />
        )}
        numColumns={2}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.columnWrapper}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            onNext={goToNextPage}
            onPrev={goToPrevPage}
          />
        }
      />
    </View>
  );
};

const PokedexListScreen: React.FC<{
  navigation: PokedexListScreenNavigationProp;
}> = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const renderSearchBar = () => (
    <View style={styles.searchContainer}>
      <View style={styles.searchInputContainer}>
        <FontAwesome6
          name="magnifying-glass"
          size={20}
          color={Colors.textLight}
          iconStyle="solid"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search any Pokémon by name or ID..."
          placeholderTextColor={Colors.gray[500]}
          value={searchQuery}
          onChangeText={setSearchQuery}
          returnKeyType="search"
          autoCorrect={false}
          autoCapitalize="none"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity
            onPress={() => setSearchQuery('')}
            style={styles.clearButton}
          >
            <FontAwesome6
              name="xmark"
              size={16}
              color={Colors.textLight}
              iconStyle="solid"
            />
          </TouchableOpacity>
        )}
      </View>
      <TouchableOpacity
        style={[
          styles.searchButton,
          !searchQuery.trim() && styles.searchButtonDisabled,
        ]}
        disabled={!searchQuery.trim()}
      >
        <FontAwesome6
          name="magnifying-glass"
          size={16}
          color={Colors.textInverse}
          iconStyle="solid"
        />
      </TouchableOpacity>
    </View>
  );

  return (
    <PokemonDataProvider>
      <View style={styles.container}>
        {renderSearchBar()}
        <TopTab.Navigator
          screenOptions={{
            tabBarActiveTintColor: Colors.primary,
            tabBarInactiveTintColor: Colors.textLight,
            tabBarIndicatorStyle: {
              backgroundColor: Colors.primary,
              height: 2,
            },
            tabBarLabelStyle: {
              fontSize: 11,
              fontWeight: 'bold',
              textTransform: 'none',
              paddingHorizontal: 4,
            },
            tabBarStyle: {
              backgroundColor: Colors.background,
              elevation: 0,
              shadowOpacity: 0,
              height: 44,
            },
            tabBarItemStyle: { width: 'auto', paddingHorizontal: 8 },
            tabBarScrollEnabled: true,
          }}
        >
          <TopTab.Screen
            name="All"
            children={props => (
              <AllPokemonTab {...props} navigation={navigation} />
            )}
            options={{ tabBarLabel: 'All' }}
          />
          <TopTab.Screen
            name="Fire"
            children={props => createTypeTab('fire')({ ...props, navigation })}
            options={{ tabBarLabel: 'Fire' }}
          />
          <TopTab.Screen
            name="Water"
            children={props => createTypeTab('water')({ ...props, navigation })}
            options={{ tabBarLabel: 'Water' }}
          />
          <TopTab.Screen
            name="Grass"
            children={props => createTypeTab('grass')({ ...props, navigation })}
            options={{ tabBarLabel: 'Grass' }}
          />
          <TopTab.Screen
            name="Electric"
            children={props =>
              createTypeTab('electric')({ ...props, navigation })
            }
            options={{ tabBarLabel: 'Electric' }}
          />
          <TopTab.Screen
            name="Ice"
            children={props => createTypeTab('ice')({ ...props, navigation })}
            options={{ tabBarLabel: 'Ice' }}
          />
          <TopTab.Screen
            name="Fighting"
            children={props =>
              createTypeTab('fighting')({ ...props, navigation })
            }
            options={{ tabBarLabel: 'Fighting' }}
          />
          <TopTab.Screen
            name="Poison"
            children={props =>
              createTypeTab('poison')({ ...props, navigation })
            }
            options={{ tabBarLabel: 'Poison' }}
          />
          <TopTab.Screen
            name="Ground"
            children={props =>
              createTypeTab('ground')({ ...props, navigation })
            }
            options={{ tabBarLabel: 'Ground' }}
          />
          <TopTab.Screen
            name="Flying"
            children={props =>
              createTypeTab('flying')({ ...props, navigation })
            }
            options={{ tabBarLabel: 'Flying' }}
          />
          <TopTab.Screen
            name="Psychic"
            children={props =>
              createTypeTab('psychic')({ ...props, navigation })
            }
            options={{ tabBarLabel: 'Psychic' }}
          />
          <TopTab.Screen
            name="Bug"
            children={props => createTypeTab('bug')({ ...props, navigation })}
            options={{ tabBarLabel: 'Bug' }}
          />
          <TopTab.Screen
            name="Rock"
            children={props => createTypeTab('rock')({ ...props, navigation })}
            options={{ tabBarLabel: 'Rock' }}
          />
          <TopTab.Screen
            name="Ghost"
            children={props => createTypeTab('ghost')({ ...props, navigation })}
            options={{ tabBarLabel: 'Ghost' }}
          />
          <TopTab.Screen
            name="Dragon"
            children={props =>
              createTypeTab('dragon')({ ...props, navigation })
            }
            options={{ tabBarLabel: 'Dragon' }}
          />
          <TopTab.Screen
            name="Dark"
            children={props => createTypeTab('dark')({ ...props, navigation })}
            options={{ tabBarLabel: 'Dark' }}
          />
          <TopTab.Screen
            name="Steel"
            children={props => createTypeTab('steel')({ ...props, navigation })}
            options={{ tabBarLabel: 'Steel' }}
          />
          <TopTab.Screen
            name="Fairy"
            children={props => createTypeTab('fairy')({ ...props, navigation })}
            options={{ tabBarLabel: 'Fairy' }}
          />
        </TopTab.Navigator>
      </View>
    </PokemonDataProvider>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 12,
  },
  nameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  typeContainer: {
    flexDirection: 'row',
    gap: 4,
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 100,
    marginBottom: 12,
    position: 'relative',
  },
  pokemonName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    flex: 1,
  },
  pokemonImage: {
    width: 80,
    height: 80,
    zIndex: 2,
  },
  statsIndicator: {
    flexDirection: 'row',
    gap: 2,
  },
  statDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.textLight,
    opacity: 0.6,
  },
  imagePlaceholder: {
    width: 60,
    height: 60,
    backgroundColor: Colors.gray[100],
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
    zIndex: 2,
  },
  searchIcon: { marginRight: 8 },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: Colors.text,
  },
  clearButton: { padding: 4 },
  searchButton: {
    backgroundColor: Colors.primary,
    padding: 12,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 44,
  },
  searchButtonDisabled: { backgroundColor: Colors.gray[400] },
  tabContainer: { flex: 1, backgroundColor: Colors.background },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
    padding: 20,
  },
  loadingText: { marginTop: 12, fontSize: 16, color: Colors.textLight },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.error,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 16,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: Colors.textInverse,
    fontSize: 16,
    fontWeight: '600',
  },
  listContent: { padding: 8, paddingBottom: 16 },
  columnWrapper: { justifyContent: 'space-between' },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  paginationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 8,
  },
  paginationButtonDisabled: { backgroundColor: Colors.gray[400] },
  paginationButtonText: {
    color: Colors.textInverse,
    fontSize: 14,
    fontWeight: '600',
  },
  paginationText: { fontSize: 14, color: Colors.text, fontWeight: '600' },
  pokemonCard: {
    width: CARD_WIDTH,
    backgroundColor: Colors.surface,
    padding: 16,
    marginBottom: CARD_MARGIN,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    overflow: 'hidden',
    position: 'relative',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
    zIndex: 2,
  },
  pokemonId: {
    fontSize: 12,
    color: Colors.textLight,
    fontWeight: '700',
  },
  pokeballDecoration: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -30 }, { translateY: -30 }],
    opacity: 0.4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pokeballLine: {
    position: 'absolute',
    width: 60,
    height: 2,
    backgroundColor: Colors.gray[300],
  },
  cardBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.3,
  },
  typesContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  typeBadge: {
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.textInverse + '30',
  },
  typeText: {
    fontSize: 8,
    color: Colors.textInverse,
    fontWeight: 'bold',
  },
  typeLabels: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  typeLabel: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    minWidth: 50,
  },
  typeLabelText: {
    fontSize: 10,
    color: Colors.textInverse,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  loadingFooter: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    gap: 8,
  },
  loadingFooterText: { fontSize: 14, color: Colors.textLight },
});

export default PokedexListScreen;
