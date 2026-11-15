import { useState } from 'react'
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native'
import { useAuth } from '../auth/AuthContext'
import { colors } from '../theme'

type Props = {
  onGoLogin: () => void
}

export function CreateAccountScreen({ onGoLogin }: Props) {
  const { register } = useAuth()
  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function onSubmit() {
    setError(null)
    setSubmitting(true)
    try {
      await register(email.trim(), password, displayName.trim())
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not create account.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.wrap}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Text style={styles.brand}>
        Fit<Text style={styles.accent}>Game</Text>
      </Text>
      <Text style={styles.title}>Create account</Text>
      <Text style={styles.sub}>Start logging reps and climbing ranks.</Text>

      <View style={styles.form}>
        <Text style={styles.label}>Display name</Text>
        <TextInput
          style={styles.input}
          autoCorrect={false}
          textContentType="name"
          value={displayName}
          onChangeText={setDisplayName}
          placeholder="What should we call you?"
          placeholderTextColor={colors.muted}
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
          textContentType="emailAddress"
          value={email}
          onChangeText={setEmail}
          placeholder="you@email.com"
          placeholderTextColor={colors.muted}
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          secureTextEntry
          textContentType="newPassword"
          value={password}
          onChangeText={setPassword}
          placeholder="At least 6 characters"
          placeholderTextColor={colors.muted}
          onSubmitEditing={onSubmit}
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Pressable
          style={[styles.primaryBtn, submitting && styles.disabled]}
          onPress={onSubmit}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator color={colors.ink} />
          ) : (
            <Text style={styles.primaryText}>Create account</Text>
          )}
        </Pressable>
      </View>

      <Pressable onPress={onGoLogin} style={styles.switchWrap}>
        <Text style={styles.switchText}>
          Already have an account? <Text style={styles.switchLink}>Log in</Text>
        </Text>
      </Pressable>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    backgroundColor: colors.ink,
  },
  brand: {
    fontSize: 36,
    fontWeight: '800',
    color: colors.sand,
    letterSpacing: -1,
  },
  accent: { color: colors.lime },
  title: {
    marginTop: 18,
    fontSize: 28,
    fontWeight: '800',
    color: colors.sand,
    letterSpacing: -0.6,
  },
  sub: {
    marginTop: 6,
    marginBottom: 22,
    color: colors.muted,
    fontSize: 15,
  },
  form: { gap: 8 },
  label: {
    marginTop: 8,
    color: colors.muted,
    fontWeight: '700',
    fontSize: 13,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: colors.sand,
    backgroundColor: colors.panel,
  },
  error: {
    marginTop: 8,
    color: '#ff6b4a',
    fontWeight: '600',
  },
  primaryBtn: {
    marginTop: 16,
    backgroundColor: colors.lime,
    borderRadius: 999,
    paddingVertical: 14,
    alignItems: 'center',
  },
  disabled: { opacity: 0.7 },
  primaryText: {
    color: colors.ink,
    fontWeight: '800',
    fontSize: 16,
  },
  switchWrap: {
    marginTop: 22,
    alignItems: 'center',
  },
  switchText: { color: colors.muted },
  switchLink: { color: colors.lime, fontWeight: '700' },
})
