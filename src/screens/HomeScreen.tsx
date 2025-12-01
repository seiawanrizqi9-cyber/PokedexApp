import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import { Colors } from '../utils/colors';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useAuth } from '../context/AuthContext';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList>;

interface Props {
  navigation: HomeScreenNavigationProp;
}

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const { trainer, isAuthenticated } = useAuth();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getWelcomeMessage = () => {
    if (isAuthenticated && trainer) {
      return `Welcome back, ${trainer.name}!`;
    }
    return 'Welcome to the World of Pokémon!';
  };

  const getSubtitle = () => {
    if (isAuthenticated && trainer) {
      return `Ready to continue your journey in ${trainer.region}?`;
    }
    return 'Your ultimate guide to the world of Pokémon!';
  };

  // Quick Actions dengan layout yang diperbaiki
  const quickActions = [
    {
      title: 'Explore Pokédex',
      description: 'Browse all Pokémon',
      icon: 'book' as const,
      color: Colors.type.water,
      image: '📚',
      onPress: () => navigation.navigate('MainTabs')
    },
    {
      title: 'Trainer Profile',
      description: 'View your progress',
      icon: 'user' as const,
      color: Colors.type.electric,
      image: '👤',
      onPress: () => navigation.navigate('MainTabs')
    },
    {
      title: 'Popular Pokémon',
      description: 'See fan favorites',
      icon: 'star' as const,
      color: Colors.type.fire,
      image: '⭐',
      onPress: () => {
        // Navigate to Pokedex tab
        navigation.navigate('MainTabs');
      }
    }
  ];

  const stats = [
    { label: 'Total Pokémon', value: '1008', icon: 'paw' as const },
    { label: 'Regions', value: '9', icon: 'globe' as const },
    { label: 'Types', value: '18', icon: 'layer-group' as const },
  ];

  const featuredPokemon = [
    { name: 'Pikachu', type: 'electric', id: 25 },
    { name: 'Charizard', type: 'fire', id: 6 },
    { name: 'Bulbasaur', type: 'grass', id: 1 },
    { name: 'Squirtle', type: 'water', id: 7 },
  ];

  const handlePokemonPress = (pokemonId: number) => {
    navigation.navigate('PokemonDetail', { pokemonId });
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.greeting}>{getGreeting()}!</Text>
        <Text style={styles.welcomeTitle}>{getWelcomeMessage()}</Text>
        <Text style={styles.subtitle}>{getSubtitle()}</Text>
      </View>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        {stats.map((stat, index) => (
          <View key={index} style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: Colors.primary + '20' }]}>
              <FontAwesome6 
                name={stat.icon} 
                size={20} 
                color={Colors.primary} 
                iconStyle="solid" 
              />
            </View>
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>

      {/* Quick Actions - LAYOUT DIPERBAIKI */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          {quickActions.map((action, index) => (
            <TouchableOpacity
              key={index}
              style={styles.actionCard}
              onPress={action.onPress}
              activeOpacity={0.7}
            >
              {/* Icon/Gambar di sebelah kiri */}
              <View style={[styles.actionImageContainer, { backgroundColor: action.color + '20' }]}>
                <Text style={styles.actionImage}>{action.image}</Text>
              </View>
              
              {/* Text content dalam column */}
              <View style={styles.actionTextContent}>
                <Text style={styles.actionTitle}>{action.title}</Text>
                <Text style={styles.actionDescription}>{action.description}</Text>
              </View>

              {/* Chevron icon di sebelah kanan */}
              <FontAwesome6 
                name="chevron-right" 
                size={16} 
                color={Colors.textLight} 
                iconStyle="solid" 
                style={styles.chevronIcon}
              />
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Featured Pokémon */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Featured Pokémon</Text>
        <View style={styles.pokemonGrid}>
          {featuredPokemon.map((pokemon) => (
            <TouchableOpacity
              key={pokemon.id}
              style={styles.pokemonCard}
              onPress={() => handlePokemonPress(pokemon.id)}
              activeOpacity={0.7}
            >
              <View style={[styles.pokemonType, { backgroundColor: Colors.type[pokemon.type as keyof typeof Colors.type] }]}>
                <Text style={styles.pokemonTypeText}>
                  {pokemon.type.toUpperCase()}
                </Text>
              </View>
              <Text style={styles.pokemonName}>{pokemon.name}</Text>
              <Text style={styles.pokemonId}>#{pokemon.id}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Features Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Features</Text>
        <View style={styles.featuresList}>
          {[
            { icon: 'search', text: 'Search any Pokémon by name or ID', color: Colors.type.psychic },
            { icon: 'filter', text: 'Filter by types and regions', color: Colors.type.grass },
            { icon: 'chart-simple', text: 'Detailed stats and abilities', color: Colors.type.dragon },
            { icon: 'user-plus', text: 'Become a Pokémon Trainer', color: Colors.type.fighting },
          ].map((feature, index) => (
            <View key={index} style={styles.featureItem}>
              <FontAwesome6 
                name={feature.icon as any} 
                size={16} 
                color={feature.color} 
                iconStyle="solid" 
                style={styles.featureIcon}
              />
              <Text style={styles.featureText}>{feature.text}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Motivational Section */}
      <View style={[styles.section, styles.motivationalSection]}>
        <FontAwesome6 
          name="quote-left" 
          size={24} 
          color={Colors.primary + '40'} 
          iconStyle="solid" 
        />
        <Text style={styles.quote}>
          "The world of Pokémon is filled with wonders and adventures waiting to be discovered. 
          Every Trainer's journey is unique - start yours today!"
        </Text>
        <View style={styles.quoteAuthor}>
          <View style={styles.authorLine} />
          <Text style={styles.authorText}>Professor Oak</Text>
        </View>
      </View>

      {/* Daily Tip */}
      <View style={[styles.section, styles.tipSection]}>
        <View style={styles.tipHeader}>
          <FontAwesome6 name="lightbulb" size={20} color={Colors.warning} iconStyle="solid" />
          <Text style={styles.tipTitle}>Did You Know?</Text>
        </View>
        <Text style={styles.tipText}>
          Pikachu, the Mouse Pokémon, can generate powerful electricity from the red sacs on its cheeks.
          When several of these Pokémon gather, their electricity can build up and cause lightning storms!
        </Text>
      </View>

      <View style={[styles.section, styles.motivationalSection]}>
        <FontAwesome6 
          name="quote-left" 
          size={24} 
          color={Colors.secondary + '40'} 
          iconStyle="solid" 
        />
        <Text style={styles.quote}>
          "Strong Pokémon. Weak Pokémon. That is only the selfish perception of people. 
          Truly skilled trainers should try to win with their favorites."
        </Text>
        <View style={styles.quoteAuthor}>
          <View style={styles.authorLine} />
          <Text style={styles.authorText}>Karen, Elite Four</Text>
        </View>
      </View>

      {/* Pokémon Fact */}
      <View style={[styles.section, styles.factSection]}>
        <View style={styles.factHeader}>
          <FontAwesome6 name="circle-info" size={20} color={Colors.info} iconStyle="solid" />
          <Text style={styles.factTitle}>Pokémon Fact</Text>
        </View>
        <Text style={styles.factText}>
          The first Pokémon ever created was Rhydon! Although Bulbasaur is #001 in the Pokédex, 
          Rhydon was the first Pokémon designed and programmed into the original games.
        </Text>
      </View>

      {/* Call to Action untuk User yang Belum Login */}
      {!isAuthenticated && (
        <View style={[styles.section, styles.ctaSection]}>
          <View style={styles.ctaContent}>
            <FontAwesome6 name="user-plus" size={40} color={Colors.secondary} iconStyle="solid" />
            <Text style={styles.ctaTitle}>Ready to Start Your Journey?</Text>
            <Text style={styles.ctaText}>
              Login to become a Pokémon Trainer and track your progress! 
              Catch Pokémon, earn badges, and become a Pokémon Master!
            </Text>
            <TouchableOpacity 
              style={styles.ctaButton}
              onPress={() => navigation.navigate('Login')}
            >
              <FontAwesome6 name="right-to-bracket" size={16} color={Colors.textInverse} iconStyle="solid" />
              <Text style={styles.ctaButtonText}>Become a Trainer</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}      

      {/* Final Encouragement */}
      <View style={[styles.section, styles.encouragementSection]}>
        <Text style={styles.encouragementTitle}>Gotta Catch 'Em All!</Text>
        <Text style={styles.encouragementText}>
          Whether you're a new Trainer or a seasoned Master, there's always more to discover 
          in the amazing world of Pokémon. Your adventure awaits!
        </Text>
        <View style={styles.encouragementIcons}>
          <FontAwesome6 name="paw" size={20} color={Colors.primary} iconStyle="solid" />
          <FontAwesome6 name="trophy" size={20} color={Colors.warning} iconStyle="solid" />
          <FontAwesome6 name="star" size={20} color={Colors.info} iconStyle="solid" />
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
  header: {
    backgroundColor: Colors.primary,
    padding: 24,
    paddingTop: 40,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    marginBottom: 24,
  },
  greeting: {
    fontSize: 16,
    color: Colors.textInverse,
    opacity: 0.9,
    marginBottom: 4,
    fontWeight: '500',
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.textInverse,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textInverse,
    opacity: 0.9,
    lineHeight: 22,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  statCard: {
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 16,
    flex: 1,
    marginHorizontal: 6,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textLight,
    textAlign: 'center',
  },
  section: {
    backgroundColor: Colors.surface,
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 20,
    borderRadius: 16,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 16,
  },
  actionsGrid: {
    gap: 12,
  },
  actionCard: {
    backgroundColor: Colors.background,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionImageContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  actionImage: {
    fontSize: 24,
  },
  actionTextContent: {
    flex: 1,
    justifyContent: 'center',
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  actionDescription: {
    fontSize: 14,
    color: Colors.textLight,
    lineHeight: 18,
  },
  chevronIcon: {
    marginLeft: 8,
  },
  pokemonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  pokemonCard: {
    width: '48%',
    backgroundColor: Colors.background,
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  pokemonType: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  pokemonTypeText: {
    fontSize: 10,
    color: Colors.textInverse,
    fontWeight: 'bold',
  },
  pokemonName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  pokemonId: {
    fontSize: 12,
    color: Colors.textLight,
  },
  featuresList: {
    gap: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureIcon: {
    marginRight: 12,
    width: 24,
  },
  featureText: {
    fontSize: 14,
    color: Colors.text,
    flex: 1,
    lineHeight: 20,
  },
  motivationalSection: {
    alignItems: 'center',
    backgroundColor: Colors.primary + '08',
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
  },
  quote: {
    fontSize: 14,
    color: Colors.text,
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 20,
    marginVertical: 12,
  },
  quoteAuthor: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  authorLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
    marginRight: 8,
  },
  authorText: {
    fontSize: 12,
    color: Colors.textLight,
    fontWeight: '500',
  },
  tipSection: {
    backgroundColor: Colors.warning + '10',
    borderLeftWidth: 4,
    borderLeftColor: Colors.warning,
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  tipTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginLeft: 8,
  },
  tipText: {
    fontSize: 14,
    color: Colors.text,
    lineHeight: 20,
  },
  factSection: {
    backgroundColor: Colors.info + '10',
    borderLeftWidth: 4,
    borderLeftColor: Colors.info,
  },
  factHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  factTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginLeft: 8,
  },
  factText: {
    fontSize: 14,
    color: Colors.text,
    lineHeight: 20,
  },
  ctaSection: {
    backgroundColor: Colors.secondary + '10',
    borderLeftWidth: 4,
    borderLeftColor: Colors.secondary,
  },
  ctaContent: {
    alignItems: 'center',
  },
  ctaTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
    marginTop: 12,
    marginBottom: 8,
    textAlign: 'center',
  },
  ctaText: {
    fontSize: 14,
    color: Colors.textLight,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.secondary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  ctaButtonText: {
    color: Colors.textInverse,
    fontSize: 16,
    fontWeight: '600',
  },
  encouragementSection: {
    backgroundColor: Colors.success + '10',
    borderLeftWidth: 4,
    borderLeftColor: Colors.success,
    alignItems: 'center',
  },
  encouragementTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  encouragementText: {
    fontSize: 14,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 20,
  },
  encouragementIcons: {
    flexDirection: 'row',
    gap: 16,
  },
});

export default HomeScreen;