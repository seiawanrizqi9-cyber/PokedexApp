import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import { Colors } from '../utils/colors';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useAuth } from '../context/AuthContext';

type TraineeScreenNavigationProp = StackNavigationProp<RootStackParamList>;

interface Props {
  navigation: TraineeScreenNavigationProp;
}

const TraineeScreen: React.FC<Props> = ({ navigation }) => {
  const { trainer, isAuthenticated, logout } = useAuth();

  const handleLoginPress = () => {
    navigation.navigate('Login');
  };

  const handleLogout = () => {
    logout();
  };

  const getLevelColor = (level: number) => {
    if (level >= 40) return Colors.type.fire;
    if (level >= 30) return Colors.type.electric;
    if (level >= 20) return Colors.type.water;
    if (level >= 10) return Colors.type.grass;
    return Colors.type.normal;
  };

  const getCompletionColor = (percentage: number) => {
    if (percentage >= 80) return Colors.success;
    if (percentage >= 50) return Colors.warning;
    return Colors.error;
  };

  // Achievement data dengan ikon berwarna
  const achievements = [
    {
      title: 'Pokémon Collector',
      description: 'Catch 50+ Pokémon',
      icon: 'paw' as const,
      color: Colors.type.water,
      progress: Math.min(((trainer?.pokemonCaught || 0) / 50) * 100, 100),
      unlocked: (trainer?.pokemonCaught || 0) >= 50,
    },
    {
      title: 'Badge Master',
      description: 'Earn 8+ Badges',
      icon: 'trophy' as const,
      color: Colors.type.electric,
      progress: Math.min(((trainer?.badges || 0) / 8) * 100, 100),
      unlocked: (trainer?.badges || 0) >= 8,
    },
    {
      title: 'Dex Expert',
      description: 'Complete 25% Pokédex',
      icon: 'book' as const,
      color: Colors.type.psychic,
      progress: trainer?.pokedexCompletion || 0,
      unlocked: (trainer?.pokedexCompletion || 0) >= 25,
    },
    {
      title: 'Veteran Trainer',
      description: 'Reach Level 30',
      icon: 'star' as const,
      color: Colors.type.fire,
      progress: Math.min(((trainer?.level || 0) / 30) * 100, 100),
      unlocked: (trainer?.level || 0) >= 30,
    },
  ];

  // Quick actions dengan ikon berwarna
  const quickActions = [
    {
      title: 'Explore Pokédex',
      description: 'Browse all Pokémon',
      icon: 'book' as const,
      color: Colors.type.water,
      onPress: () => navigation.navigate('MainTabs'),
    },
    {
      title: 'Catch Pokémon',
      description: 'Add to your collection',
      icon: 'paw' as const,
      color: Colors.type.grass,
      onPress: () => navigation.navigate('MainTabs'),
    },
    {
      title: 'Trainer Stats',
      description: 'View your progress',
      icon: 'chart-simple' as const,
      color: Colors.type.electric,
      onPress: () => navigation.navigate('MainTabs'),
    },
    {
      title: 'Achievements',
      description: 'Your accomplishments',
      icon: 'trophy' as const,
      color: Colors.type.fire,
      onPress: () => navigation.navigate('MainTabs'),
    },
  ];

  // Stats dengan ikon berwarna
  const statsCards = [
    {
      label: 'Pokémon Caught',
      value: trainer?.pokemonCaught.toString() || '0',
      icon: 'paw' as const,
      color: Colors.type.water,
      bgColor: Colors.type.water + '20',
    },
    {
      label: 'Gym Badges',
      value: trainer?.badges.toString() || '0',
      icon: 'trophy' as const,
      color: Colors.type.electric,
      bgColor: Colors.type.electric + '20',
    },
    {
      label: 'Trainer Level',
      value: `Lv. ${trainer?.level || '1'}`,
      icon: 'star' as const,
      color: Colors.type.fire,
      bgColor: Colors.type.fire + '20',
    },
    {
      label: 'Region',
      value: trainer?.region || 'Kanto',
      icon: 'map' as const,
      color: Colors.type.grass,
      bgColor: Colors.type.grass + '20',
    },
  ];

  if (!isAuthenticated || !trainer) {
    return (
      <ScrollView
        style={styles.container}
      >
        {/* Header Welcome Trainer */}
        <View style={styles.welcomeHeader}>
          <Text style={styles.welcomeTitle}>Welcome Trainer</Text>
        </View>

        {/* Guest Card */}
        <View style={styles.section}>
          <View style={styles.guestCard}>
            <FontAwesome6
              name="user-plus"
              size={48}
              color={Colors.primary}
              iconStyle="solid"
            />
            <Text style={styles.guestTitle}>Become a Pokémon Trainer!</Text>
            <Text style={styles.guestText}>
              Join thousands of trainers worldwide. Catch Pokémon, earn badges,
              and become a Pokémon Master!
            </Text>
            <TouchableOpacity
              style={styles.loginButton}
              onPress={handleLoginPress}
            >
              <FontAwesome6
                name="right-to-bracket"
                size={16}
                color={Colors.textInverse}
                iconStyle="solid"
              />
              <Text style={styles.loginButtonText}>Start Your Journey</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>Trainer Benefits</Text>

          <View style={styles.featureItem}>
            <FontAwesome6
              name="paw"
              size={20}
              color={Colors.primary}
              iconStyle="solid"
            />
            <Text style={styles.featureText}>Catch and collect Pokémon</Text>
          </View>

          <View style={styles.featureItem}>
            <FontAwesome6
              name="trophy"
              size={20}
              color={Colors.primary}
              iconStyle="solid"
            />
            <Text style={styles.featureText}>Earn Gym Badges</Text>
          </View>

          <View style={styles.featureItem}>
            <FontAwesome6
              name="chart-line"
              size={20}
              color={Colors.primary}
              iconStyle="solid"
            />
            <Text style={styles.featureText}>Track your progress</Text>
          </View>

          <View style={styles.featureItem}>
            <FontAwesome6
              name="ranking-star"
              size={20}
              color={Colors.primary}
              iconStyle="solid"
            />
            <Text style={styles.featureText}>Level up as a Trainer</Text>
          </View>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Profile Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View
            style={[
              styles.avatar,
              { backgroundColor: getLevelColor(trainer.level) + '40' },
            ]}
          >
            <FontAwesome6
              name="user"
              size={40}
              color={getLevelColor(trainer.level)}
              iconStyle="solid"
            />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.trainerName}>{trainer.name}</Text>
            <View
              style={[
                styles.levelBadge,
                { backgroundColor: getLevelColor(trainer.level) },
              ]}
            >
              <FontAwesome6
                name="star"
                size={12}
                color={Colors.textInverse}
                iconStyle="solid"
              />
              <Text style={styles.levelText}>Level {trainer.level}</Text>
            </View>
            <Text style={styles.regionText}>{trainer.region} Region</Text>
          </View>
        </View>
      </View>

      {/* Stats Grid dengan Ikon Berwarna */}
      <View style={styles.statsGrid}>
        {statsCards.map((stat, index) => (
          <View key={index} style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: stat.bgColor }]}>
              <FontAwesome6
                name={stat.icon}
                size={20}
                color={stat.color}
                iconStyle="solid"
              />
            </View>
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>

      {/* Quick Actions */}
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
              <View
                style={[
                  styles.actionIcon,
                  { backgroundColor: action.color + '20' },
                ]}
              >
                <FontAwesome6
                  name={action.icon}
                  size={20}
                  color={action.color}
                  iconStyle="solid"
                />
              </View>
              <View style={styles.actionTextContent}>
                <Text style={styles.actionTitle}>{action.title}</Text>
                <Text style={styles.actionDescription}>
                  {action.description}
                </Text>
              </View>
              <FontAwesome6
                name="chevron-right"
                size={16}
                color={Colors.textLight}
                iconStyle="solid"
              />
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Pokédex Progress */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Pokédex Progress</Text>
        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <View style={styles.progressLabel}>
              <FontAwesome6
                name="book"
                size={20}
                color={Colors.type.psychic}
                iconStyle="solid"
              />
              <Text style={styles.progressTitle}>Completion</Text>
            </View>
            <Text
              style={[
                styles.progressPercentage,
                { color: getCompletionColor(trainer.pokedexCompletion) },
              ]}
            >
              {trainer.pokedexCompletion}%
            </Text>
          </View>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${trainer.pokedexCompletion}%`,
                  backgroundColor: getCompletionColor(
                    trainer.pokedexCompletion,
                  ),
                },
              ]}
            />
          </View>
          <Text style={styles.progressSubtext}>
            {trainer.pokemonCaught} Pokémon caught of 1008 total
          </Text>
        </View>
      </View>

      {/* Achievements */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Achievements</Text>
        <View style={styles.achievementsGrid}>
          {achievements.map((achievement, index) => (
            <View key={index} style={styles.achievementCard}>
              <View style={styles.achievementHeader}>
                <View
                  style={[
                    styles.achievementIcon,
                    {
                      backgroundColor: achievement.unlocked
                        ? achievement.color + '20'
                        : Colors.gray[200],
                    },
                  ]}
                >
                  <FontAwesome6
                    name={achievement.icon}
                    size={16}
                    color={
                      achievement.unlocked
                        ? achievement.color
                        : Colors.gray[500]
                    }
                    iconStyle="solid"
                  />
                </View>
                {achievement.unlocked && (
                  <FontAwesome6
                    name="check"
                    size={12}
                    color={Colors.success}
                    iconStyle="solid"
                  />
                )}
              </View>
              <Text
                style={[
                  styles.achievementTitle,
                  !achievement.unlocked && styles.achievementLocked,
                ]}
              >
                {achievement.title}
              </Text>
              <Text style={styles.achievementDescription}>
                {achievement.description}
              </Text>
              <View style={styles.achievementProgress}>
                <View style={styles.progressBarSmall}>
                  <View
                    style={[
                      styles.progressFillSmall,
                      {
                        width: `${achievement.progress}%`,
                        backgroundColor: achievement.unlocked
                          ? achievement.color
                          : Colors.gray[400],
                      },
                    ]}
                  />
                </View>
                <Text style={styles.progressText}>
                  {Math.round(achievement.progress)}%
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Trainer Journey */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Trainer Journey</Text>
        <View style={styles.journeyCard}>
          {[
            {
              icon: 'calendar',
              text: `Joined: ${trainer.joinDate}`,
              color: Colors.type.normal,
            },
            {
              icon: 'flag-checkered',
              text: `Region: ${trainer.region}`,
              color: Colors.type.flying,
            },
            {
              icon: 'clock',
              text: 'Member: 6 months',
              color: Colors.type.psychic,
            },
            {
              icon: 'medal',
              text: 'Rank: Pokémon Trainer',
              color: Colors.type.dragon,
            },
          ].map((item, index) => (
            <View key={index} style={styles.journeyItem}>
              <FontAwesome6
                name={item.icon as any}
                size={16}
                color={item.color}
                iconStyle="solid"
              />
              <Text style={styles.journeyText}>{item.text}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Motivational Section */}
      <View style={[styles.section, styles.motivationalSection]}>
        <FontAwesome6
          name="quote-left"
          size={20}
          color={Colors.primary + '40'}
          iconStyle="solid"
        />
        <Text style={styles.quote}>
          "The journey of a Pokémon Trainer is filled with challenges and
          friendships. Every step brings you closer to becoming a true Pokémon
          Master!"
        </Text>
        <View style={styles.quoteAuthor}>
          <View style={styles.authorLine} />
          <Text style={styles.authorText}>Professor Oak</Text>
        </View>
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <FontAwesome6
          name="right-from-bracket"
          size={16}
          color={Colors.textInverse}
          iconStyle="solid"
        />
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
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
    paddingTop: 50,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    marginBottom: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  trainerName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.textInverse,
    marginBottom: 4,
  },
  levelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
    marginBottom: 4,
  },
  levelText: {
    fontSize: 12,
    color: Colors.textInverse,
    fontWeight: 'bold',
  },
  regionText: {
    fontSize: 14,
    color: Colors.textInverse,
    opacity: 0.9,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.textInverse,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textInverse,
    opacity: 0.9,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    marginBottom: 20,
    gap: 12,
  },
  statCard: {
    width: '47%',
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
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
    fontSize: 18,
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
    marginHorizontal: 16,
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
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  actionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  actionTextContent: {
    flex: 1,
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
  },
  progressCard: {
    backgroundColor: Colors.background,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  progressPercentage: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  progressBar: {
    height: 8,
    backgroundColor: Colors.gray[200],
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressSubtext: {
    fontSize: 12,
    color: Colors.textLight,
  },
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  achievementCard: {
    width: '47%',
    backgroundColor: Colors.background,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  achievementHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  achievementIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  achievementTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  achievementLocked: {
    color: Colors.textLight,
  },
  achievementDescription: {
    fontSize: 12,
    color: Colors.textLight,
    marginBottom: 12,
    lineHeight: 16,
  },
  achievementProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  progressBarSmall: {
    flex: 1,
    height: 4,
    backgroundColor: Colors.gray[200],
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFillSmall: {
    height: '100%',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 10,
    color: Colors.textLight,
    fontWeight: '600',
    minWidth: 30,
  },
  journeyCard: {
    backgroundColor: Colors.background,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 12,
  },
  journeyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  journeyText: {
    fontSize: 14,
    color: Colors.text,
    flex: 1,
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
    width: '100%',
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
  guestCard: {
    alignItems: 'center',
    padding: 24,
  },
  guestTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  guestText: {
    fontSize: 14,
    color: Colors.textLight,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  loginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  loginButtonText: {
    color: Colors.textInverse,
    fontSize: 16,
    fontWeight: '600',
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  featureCard: {
    width: '47%',
    backgroundColor: Colors.background,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  featureIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
    textAlign: 'center',
  },
  featureDescription: {
    fontSize: 12,
    color: Colors.textLight,
    textAlign: 'center',
    lineHeight: 16,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.error,
    marginHorizontal: 16,
    marginBottom: 30,
    padding: 16,
    borderRadius: 12,
  },
  logoutButtonText: {
    color: Colors.textInverse,
    fontSize: 16,
    fontWeight: 'bold',
  },
  welcomeHeader: {
    backgroundColor: Colors.primary,
    padding: 30,
    alignItems: 'center',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    marginBottom: 20,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.textInverse,
    textAlign: 'center',
  },
  featuresSection: {
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
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  featureText: {
    fontSize: 16,
    color: Colors.text,
    flex: 1,
  },
});

export default TraineeScreen;
