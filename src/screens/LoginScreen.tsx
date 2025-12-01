import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import { Colors } from '../utils/colors';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useAuth } from '../context/AuthContext';

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

interface Props {
  navigation: LoginScreenNavigationProp;
}

// Demo accounts data - should match AuthContext
const demoAccounts = [
  {
    id: 1,
    name: 'Ash Ketchum',
    username: 'ash ketchum',
    password: 'pikachu123',
    region: 'Kanto',
    badgeCount: 8,
    pokemonCaught: 42,
    description: 'The aspiring Pokémon Master from Pallet Town'
  },
  {
    id: 2,
    name: 'Misty',
    username: 'misty',
    password: 'starmie123',
    region: 'Kanto',
    badgeCount: 0,
    pokemonCaught: 15,
    description: 'Cerulean City Gym Leader, water Pokémon specialist'
  },
  {
    id: 3,
    name: 'Brock',
    username: 'brock',
    password: 'onix123',
    region: 'Kanto',
    badgeCount: 0,
    pokemonCaught: 22,
    description: 'Pewter City Gym Leader, rock Pokémon expert'
  }
];

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Error', 'Please enter both username and password');
      return;
    }

    setLoading(true);

    try {
      const success = await login(username, password);
      if (success) {
        const trainerName = demoAccounts.find(acc => acc.username === username)?.name || 'Trainer';
        Alert.alert('Success', `Welcome back, ${trainerName}!`, [
          {
            text: 'Continue Journey',
            onPress: () => navigation.goBack(),
          },
        ]);
      } else {
        Alert.alert('Error', 'Invalid username or password');
      }
    } catch (error) {
      Alert.alert('Error', 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoAccount = (account: typeof demoAccounts[0]) => {
    setUsername(account.username);
    setPassword(account.password);
  };

  const clearCredentials = () => {
    setUsername('');
    setPassword('');
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header Section */}
      <View style={styles.header}>
        <FontAwesome6 
          name="user-ninja" 
          size={60} 
          color={Colors.textInverse} 
          iconStyle="solid" 
        />
        <Text style={styles.title}>Trainer Login</Text>
        <Text style={styles.subtitle}>Enter your credentials to continue your journey</Text>
      </View>

      {/* Login Form - AT THE TOP */}
      <View style={styles.formContainer}>
        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <FontAwesome6 
              name="user" 
              size={20} 
              color={Colors.textLight} 
              iconStyle="solid" 
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Username"
              placeholderTextColor={Colors.gray[500]}
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              autoCorrect={false}
            />
            {username.length > 0 && (
              <TouchableOpacity onPress={() => setUsername('')} style={styles.clearButton}>
                <FontAwesome6 name="xmark" size={16} color={Colors.textLight} iconStyle="solid" />
              </TouchableOpacity>
            )}
          </View>
          
          <View style={styles.inputContainer}>
            <FontAwesome6 
              name="lock" 
              size={20} 
              color={Colors.textLight} 
              iconStyle="solid" 
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor={Colors.gray[500]}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
            />
            {password.length > 0 && (
              <TouchableOpacity onPress={() => setPassword('')} style={styles.clearButton}>
                <FontAwesome6 name="xmark" size={16} color={Colors.textLight} iconStyle="solid" />
              </TouchableOpacity>
            )}
          </View>

          {/* Clear All Button */}
          {(username.length > 0 || password.length > 0) && (
            <TouchableOpacity style={styles.clearAllButton} onPress={clearCredentials}>
              <FontAwesome6 name="broom" size={16} color={Colors.textLight} iconStyle="solid" />
              <Text style={styles.clearAllText}>Clear All</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[styles.loginButton, loading && styles.loginButtonDisabled]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <View style={styles.loadingContainer}>
                <FontAwesome6 name="spinner" size={16} color={Colors.textInverse} iconStyle="solid" />
                <Text style={styles.loginButtonText}>Logging in...</Text>
              </View>
            ) : (
              <View style={styles.loadingContainer}>
                <FontAwesome6 name="right-to-bracket" size={16} color={Colors.textInverse} iconStyle="solid" />
                <Text style={styles.loginButtonText}>Login</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Demo Accounts Section - AT THE BOTTOM */}
        <View style={styles.demoSection}>
          <View style={styles.sectionHeader}>
            <FontAwesome6 name="users" size={20} color={Colors.primary} iconStyle="solid" />
            <Text style={styles.sectionTitle}>Demo Trainers</Text>
          </View>
          <Text style={styles.sectionDescription}>
            Try these demo accounts to explore the app features
          </Text>

          <View style={styles.demoAccountsGrid}>
            {demoAccounts.map((account) => (
              <TouchableOpacity
                key={account.id}
                style={[
                  styles.demoAccountCard,
                  username === account.username && styles.demoAccountCardSelected
                ]}
                onPress={() => handleDemoAccount(account)}
              >
                <View style={styles.accountHeader}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>
                      {account.name.split(' ').map(n => n[0]).join('')}
                    </Text>
                  </View>
                  <View style={styles.accountInfo}>
                    <Text style={styles.accountName}>{account.name}</Text>
                    <Text style={styles.accountRegion}>{account.region}</Text>
                  </View>
                </View>
                
                <Text style={styles.accountDescription}>{account.description}</Text>
                
                <View style={styles.accountStats}>
                  <View style={styles.stat}>
                    <FontAwesome6 name="trophy" size={12} color={Colors.warning} iconStyle="solid" />
                    <Text style={styles.statText}>{account.badgeCount} Badges</Text>
                  </View>
                  <View style={styles.stat}>
                    <FontAwesome6 name="paw" size={12} color={Colors.success} iconStyle="solid" />
                    <Text style={styles.statText}>{account.pokemonCaught} Pokémon</Text>
                  </View>
                </View>

                <View style={styles.demoBadge}>
                  <Text style={styles.demoBadgeText}>DEMO</Text>
                </View>

                {username === account.username && (
                  <View style={styles.selectedIndicator}>
                    <FontAwesome6 name="check" size={16} color={Colors.textInverse} iconStyle="solid" />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>

          {/* Quick Login Button for Selected Account */}
          {username && password && (
            <TouchableOpacity 
              style={styles.quickLoginButton}
              onPress={handleLogin}
              disabled={loading}
            >
              <FontAwesome6 name="bolt" size={16} color={Colors.textInverse} iconStyle="solid" />
              <Text style={styles.quickLoginText}>
                Quick Login as {demoAccounts.find(acc => acc.username === username)?.name}
              </Text>
            </TouchableOpacity>
          )}
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
    padding: 30,
    paddingTop: 50,
    alignItems: 'center',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.textInverse,
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textInverse,
    textAlign: 'center',
    opacity: 0.9,
  },
  formContainer: {
    padding: 20,
  },
  form: {
    gap: 16,
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
    color: Colors.text,
  },
  clearButton: {
    padding: 4,
  },
  clearAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 12,
    backgroundColor: Colors.gray[100],
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  clearAllText: {
    fontSize: 14,
    color: Colors.textLight,
    fontWeight: '500',
  },
  loginButton: {
    backgroundColor: Colors.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  loginButtonDisabled: {
    backgroundColor: Colors.gray[400],
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  loginButtonText: {
    color: Colors.textInverse,
    fontSize: 16,
    fontWeight: 'bold',
  },
  demoSection: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
  },
  sectionDescription: {
    fontSize: 14,
    color: Colors.textLight,
    marginBottom: 16,
    lineHeight: 20,
  },
  demoAccountsGrid: {
    gap: 12,
  },
  demoAccountCard: {
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.border,
    position: 'relative',
  },
  demoAccountCardSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + '08',
  },
  accountHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  accountInfo: {
    flex: 1,
  },
  accountName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 2,
  },
  accountRegion: {
    fontSize: 12,
    color: Colors.textLight,
  },
  accountDescription: {
    fontSize: 12,
    color: Colors.textLight,
    marginBottom: 12,
    lineHeight: 16,
  },
  accountStats: {
    flexDirection: 'row',
    gap: 16,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statText: {
    fontSize: 12,
    color: Colors.textLight,
  },
  demoBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: Colors.warning,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  demoBadgeText: {
    fontSize: 10,
    color: Colors.textInverse,
    fontWeight: 'bold',
  },
  selectedIndicator: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: Colors.primary,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.background,
  },
  quickLoginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.success,
    padding: 16,
    borderRadius: 12,
    marginTop: 12,
  },
  quickLoginText: {
    color: Colors.textInverse,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LoginScreen;