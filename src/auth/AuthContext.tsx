import AsyncStorage from '@react-native-async-storage/async-storage'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  fetchMe,
  loginAccount,
  registerAccount,
  type User,
} from '../api'

const TOKEN_KEY = 'fitgame-auth-token'

type AuthContextValue = {
  user: User | null
  token: string | null
  booting: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, displayName: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [booting, setBooting] = useState(true)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const saved = await AsyncStorage.getItem(TOKEN_KEY)
        if (!saved) return
        const me = await fetchMe(saved)
        if (!cancelled) {
          setToken(saved)
          setUser(me)
        }
      } catch {
        await AsyncStorage.removeItem(TOKEN_KEY)
      } finally {
        if (!cancelled) setBooting(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const persist = useCallback(async (nextToken: string, nextUser: User) => {
    await AsyncStorage.setItem(TOKEN_KEY, nextToken)
    setToken(nextToken)
    setUser(nextUser)
  }, [])

  const login = useCallback(
    async (email: string, password: string) => {
      const result = await loginAccount({ email, password })
      await persist(result.token, result.user)
    },
    [persist],
  )

  const register = useCallback(
    async (email: string, password: string, displayName: string) => {
      const result = await registerAccount({ email, password, displayName })
      await persist(result.token, result.user)
    },
    [persist],
  )

  const logout = useCallback(async () => {
    await AsyncStorage.removeItem(TOKEN_KEY)
    setToken(null)
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({ user, token, booting, login, register, logout }),
    [user, token, booting, login, register, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
