import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { RouteProp } from '@react-navigation/native';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import { Colors } from '../utils/colors';
import { pokemonService } from '../services/api';
import { Pokemon } from '../types/pokemon';
import { RootStackParamList } from '../navigation/AppNavigator';

type PokemonDetailScreenRouteProp = RouteProp<RootStackParamList, 'PokemonDetail'>;

interface Props {
  route: PokemonDetailScreenRouteProp;
}

const { width } = Dimensions.get('window');

const PokemonDetailScreen: React.FC<Props> = ({ route }) => {
  const { pokemonId } = route.params;
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<'official' | 'front' | 'back'>('official');

  const loadPokemonDetail = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await pokemonService.getPokemonDetail(pokemonId);
      setPokemon(response.data);
    } catch (err) {
      setError('Failed to load Pokémon details');
      console.error('Error loading pokemon detail:', err);
    } finally {
      setLoading(false);
    }
  }, [pokemonId]);

  useEffect(() => {
    loadPokemonDetail();
  }, [loadPokemonDetail]);

  const getTypeColor = (typeName: string) => {
    const typeColors: any = Colors.type;
    return typeColors[typeName] || Colors.gray[500];
  };

  const getStatColor = (statName: string) => {
    const statColors: { [key: string]: string } = {
      hp: '#FF5959',
      attack: '#F5AC78',
      defense: '#FAE078',
      'special-attack': '#9DB7F5',
      'special-defense': '#A7DB8D',
      speed: '#FA92B2',
    };
    return statColors[statName] || Colors.gray[500];
  };

  const getGenderRatio = (genderRate: number) => {
    if (genderRate === -1) return 'Genderless';
    const femalePercentage = (genderRate / 8) * 100;
    const malePercentage = 100 - femalePercentage;
    return `♂ ${malePercentage}% ♀ ${femalePercentage}%`;
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Loading Pokémon details...</Text>
      </View>
    );
  }

  if (error || !pokemon) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error || 'Pokémon not found'}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadPokemonDetail}>
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // FIX: Perbaiki type untuk sprites
  const sprites = pokemon.sprites as any;
  const imageUrls = {
    official: sprites.other?.['official-artwork']?.front_default,
    front: sprites.front_default,
    back: sprites.back_default || sprites.front_default,
  };

  const currentImage = imageUrls[selectedImage] || imageUrls.official;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.pokemonName}>
            {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
          </Text>
          <Text style={styles.pokemonId}>#{pokemon.id.toString().padStart(3, '0')}</Text>
        </View>
      </View>

      {/* Image Gallery */}
      <View style={styles.imageSection}>
        <View style={styles.imageContainer}>
          {currentImage ? (
            <Image
              source={{ uri: currentImage }}
              style={styles.pokemonImage}
              resizeMode="contain"
            />
          ) : (
            <View style={styles.imagePlaceholder}>
              <FontAwesome6 name="image" size={60} color={Colors.gray[400]} iconStyle="solid" />
              <Text style={styles.placeholderText}>No Image Available</Text>
            </View>
          )}
        </View>

        {/* Image Selector */}
        <View style={styles.imageSelector}>
          <TouchableOpacity
            style={[
              styles.imageOption,
              selectedImage === 'official' && styles.imageOptionSelected
            ]}
            onPress={() => setSelectedImage('official')}
          >
            <Text style={[
              styles.imageOptionText,
              selectedImage === 'official' && styles.imageOptionTextSelected
            ]}>
              Official
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.imageOption,
              selectedImage === 'front' && styles.imageOptionSelected
            ]}
            onPress={() => setSelectedImage('front')}
          >
            <Text style={[
              styles.imageOptionText,
              selectedImage === 'front' && styles.imageOptionTextSelected
            ]}>
              Front
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.imageOption,
              selectedImage === 'back' && styles.imageOptionSelected
            ]}
            onPress={() => setSelectedImage('back')}
          >
            <Text style={[
              styles.imageOptionText,
              selectedImage === 'back' && styles.imageOptionTextSelected
            ]}>
              Back
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Basic Info Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Basic Information</Text>
        <View style={styles.basicInfoGrid}>
          <View style={styles.infoItem}>
            <FontAwesome6 name="ruler" size={16} color={Colors.textLight} iconStyle="solid" />
            <Text style={styles.infoLabel}>Height</Text>
            <Text style={styles.infoValue}>{pokemon.height / 10} m</Text>
          </View>
          <View style={styles.infoItem}>
            <FontAwesome6 name="weight-scale" size={16} color={Colors.textLight} iconStyle="solid" />
            <Text style={styles.infoLabel}>Weight</Text>
            <Text style={styles.infoValue}>{pokemon.weight / 10} kg</Text>
          </View>
          <View style={styles.infoItem}>
            <FontAwesome6 name="star" size={16} color={Colors.textLight} iconStyle="solid" />
            <Text style={styles.infoLabel}>Base EXP</Text>
            <Text style={styles.infoValue}>{pokemon.base_experience || 'N/A'}</Text>
          </View>
        </View>
      </View>

      {/* Types Section */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Types</Text>
        <View style={styles.typesContainer}>
          {pokemon.types.map((typeInfo, index) => (
            <View
              key={index}
              style={[
                styles.typeBadge,
                { backgroundColor: getTypeColor(typeInfo.type.name) }
              ]}
            >
              <FontAwesome6 name="tag" size={12} color={Colors.textInverse} iconStyle="solid" />
              <Text style={styles.typeText}>
                {typeInfo.type.name.toUpperCase()}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Stats Section */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Base Stats</Text>
        <View style={styles.statsContainer}>
          {pokemon.stats.map((statInfo, index) => (
            <View key={index} style={styles.statRow}>
              <View style={styles.statHeader}>
                <Text style={styles.statName}>
                  {statInfo.stat.name.replace('-', ' ').toUpperCase()}
                </Text>
                <Text style={styles.statValue}>{statInfo.base_stat}</Text>
              </View>
              <View style={styles.statBarContainer}>
                <View
                  style={[
                    styles.statBar,
                    {
                      width: `${(statInfo.base_stat / 255) * 100}%`,
                      backgroundColor: getStatColor(statInfo.stat.name),
                    }
                  ]}
                />
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Abilities Section */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Abilities</Text>
        <View style={styles.abilitiesContainer}>
          {pokemon.abilities.map((abilityInfo, index) => (
            <View key={index} style={styles.abilityBadge}>
              {/* FIX: Ganti dengan icon yang valid */}
              <FontAwesome6 
                name="bolt" 
                size={12} 
                color={abilityInfo.is_hidden ? Colors.warning : Colors.primary} 
                iconStyle="solid" 
              />
              <Text style={styles.abilityText}>
                {abilityInfo.ability.name.replace('-', ' ').toUpperCase()}
                {abilityInfo.is_hidden && ' (Hidden)'}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Characteristics */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Characteristics</Text>
        <View style={styles.characteristicsGrid}>
          <View style={styles.characteristicItem}>
            <FontAwesome6 name="face-smile-beam" size={16} color={Colors.textLight} iconStyle="solid" />
            <Text style={styles.characteristicLabel}>Base Happiness</Text>
            <Text style={styles.characteristicValue}>{pokemon.base_experience ? 'High' : 'Normal'}</Text>
          </View>
          <View style={styles.characteristicItem}>
            {/* FIX: Ganti dengan icon yang valid */}
            <FontAwesome6 name="person-running" size={16} color={Colors.textLight} iconStyle="solid" />
            <Text style={styles.characteristicLabel}>Capture Rate</Text>
            <Text style={styles.characteristicValue}>Normal</Text>
          </View>
          <View style={styles.characteristicItem}>
            <FontAwesome6 name="venus-mars" size={16} color={Colors.textLight} iconStyle="solid" />
            <Text style={styles.characteristicLabel}>Gender Ratio</Text>
            <Text style={styles.characteristicValue}>{getGenderRatio(-1)}</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: Colors.textLight,
  },
  errorText: {
    fontSize: 16,
    color: Colors.error,
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
  header: {
    backgroundColor: Colors.primary,
    padding: 20,
    paddingTop: 40,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pokemonName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.textInverse,
  },
  pokemonId: {
    fontSize: 18,
    color: Colors.textInverse,
    fontWeight: '600',
    opacity: 0.9,
  },
  imageSection: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: Colors.surface,
  },
  imageContainer: {
    width: width - 80,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  pokemonImage: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.gray[100],
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
  },
  placeholderText: {
    fontSize: 14,
    color: Colors.gray[500],
    marginTop: 8,
  },
  imageSelector: {
    flexDirection: 'row',
    gap: 12,
  },
  imageOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.gray[100],
    borderWidth: 2,
    borderColor: 'transparent',
  },
  imageOptionSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primaryDark,
  },
  imageOptionText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textLight,
  },
  imageOptionTextSelected: {
    color: Colors.textInverse,
  },
  card: {
    backgroundColor: Colors.surface,
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 20,
    borderRadius: 16,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 16,
  },
  basicInfoGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoItem: {
    alignItems: 'center',
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: Colors.textLight,
    marginTop: 4,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
  },
  typesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  typeText: {
    fontSize: 12,
    color: Colors.textInverse,
    fontWeight: 'bold',
  },
  statsContainer: {
    gap: 16,
  },
  statRow: {
    gap: 8,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statName: {
    fontSize: 12,
    color: Colors.textLight,
    fontWeight: '600',
    flex: 1,
  },
  statValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.text,
    width: 30,
    textAlign: 'right',
  },
  statBarContainer: {
    height: 8,
    backgroundColor: Colors.gray[200],
    borderRadius: 4,
    overflow: 'hidden',
  },
  statBar: {
    height: '100%',
    borderRadius: 4,
  },
  abilitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  abilityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.gray[100],
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 6,
  },
  abilityText: {
    fontSize: 11,
    color: Colors.text,
    fontWeight: '500',
  },
  characteristicsGrid: {
    gap: 12,
  },
  characteristicItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  characteristicLabel: {
    fontSize: 14,
    color: Colors.textLight,
    flex: 1,
  },
  characteristicValue: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
});

export default PokemonDetailScreen;