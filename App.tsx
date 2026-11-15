import { StatusBar } from 'expo-status-bar'
import { useState } from 'react'
import { ActivityIndicator, SafeAreaView, StyleSheet } from 'react-native'
import { AuthProvider, useAuth } from './src/auth/AuthContext'
import { CreateAccountScreen } from './src/screens/CreateAccountScreen'
import { HomeScreen } from './src/screens/HomeScreen'
import { LoginScreen } from './src/screens/LoginScreen'
import { colors } from './src/theme'

type AuthPage = 'login' | 'create'

function Root() {
  const { user, booting } = useAuth()
  const [authPage, setAuthPage] = useState<AuthPage>('login')

  if (booting) {
    return (
      <SafeAreaView style={styles.boot}>
        <ActivityIndicator color={colors.lime} size="large" />
      </SafeAreaView>
    )
  }

  if (!user) {
    if (authPage === 'create') {
      return <CreateAccountScreen onGoLogin={() => setAuthPage('login')} />
    }
    return <LoginScreen onGoCreate={() => setAuthPage('create')} />
  }

  return <HomeScreen />
}

export default function App() {
  return (
    <AuthProvider>
      <StatusBar style="light" />
      <Root />
    </AuthProvider>
  )
}

const styles = StyleSheet.create({
  boot: {
    flex: 1,
    backgroundColor: colors.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
