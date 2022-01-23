import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  User,
  GoogleAuthProvider,
} from 'firebase/auth'
import React, { useState, useContext, createContext, useEffect } from 'react'

import { auth } from 'config/firebase'

interface AuthContextProps {
  initialLoading: boolean
  currentUser: User | null
  signup: (email: string, password: string) => void
  login: (email: string, password: string) => void
  logout: () => void
  loginWithGoogle: () => void
}
const initialContext = {
  initialLoading: false,
  currentUser: null,
  signup: () => {},
  login: () => {},
  logout: () => {},
  loginWithGoogle: () => {},
}
const AuthContext = createContext<AuthContextProps>(initialContext)

export const useAuth = () => {
  return useContext(AuthContext)
}

interface Props {
  children: React.ReactNode
}

export const AuthProvider: React.FC<Props> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  const signup = (email: string, password: string) => {
    return createUserWithEmailAndPassword(auth, email, password)
  }

  const login = (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password)
  }

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider()
    await signInWithPopup(auth, provider)
  }

  const logout = () => {
    return signOut(auth)
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const value: AuthContextProps = {
    initialLoading: loading,
    currentUser,
    signup,
    login,
    logout,
    loginWithGoogle,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
