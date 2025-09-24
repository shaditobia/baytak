import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { firebaseDb, firebaseAuth } from '../utility/firebaseConfig'
import userService from '../services/userService'
import {
  collection,
  addDoc,
  getDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  setDoc,
} from 'firebase/firestore'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth'

export const useAuthStore = defineStore('authStore', () => {
  const user = ref(null)
  const error = ref(null)
  const loading = ref(false)
  const role = ref(null)
  const initialized = ref(false)
  const maxPropertiesAllowed = ref(2)

  const isAuthenticated = computed(() => {
    return user.value !== null
  })
  const isUserAdmin = computed(() => {
    return role.value === 'admin'
  })
  const isUserSeller = computed(() => {
    return role.value === 'seller'
  })
  const roleOptions = computed(() => {
    return role.value ? [role.value] : []
  })

  const fetchUserRole = async (uid) => {
    const userDoc = await getDoc(doc(firebaseDb, 'users', uid))
    role.value = userDoc.exists() ? userDoc.data().role : null
    console.log('Fetched user role:', role.value)
    return role.value
  }
  const initializeAuth = () => {
    return new Promise((resolve) => {
      onAuthStateChanged(firebaseAuth, async (firebaseUser) => {
        if (firebaseUser) {
          user.value = firebaseUser
          role.value = await fetchUserRole(user.value.uid)
          error.value = null
          initialized.value = true
        } else {
          user.value = null
          role.value = null
          error.value = null
        }
        resolve()
      })
    })
  }
  const signUpUser = async (email, password) => {
    try {
      loading.value = true
      const userCredentials = await createUserWithEmailAndPassword(firebaseAuth, email, password)
      user.value = userCredentials.user
      console.log('User info:', user.value)
      error.value = null
    } catch (err) {
      error.value = err.message
      console.log(error.value)
      throw err
    } finally {
      loading.value = false
    }
  }

  const checkEmailExists = async (email) => {
    const users = await userService.getUsers()
    return users.some((user) => user.email === email)
  }
  const signInUser = async (email, password) => {
    try {
      loading.value = true
      const userCredentials = await signInWithEmailAndPassword(firebaseAuth, email, password)
      user.value = userCredentials.user
      role.value = await fetchUserRole(user.value.uid)
      console.log('Signed in user info:', role.value)
      error.value = null
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  const signOutUser = async () => {
    try {
      loading.value = true
      await signOut(firebaseAuth)
      user.value = null
      role.value = null
      error.value = null
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  return {
    user,
    error,
    loading,
    isAuthenticated,

    //getters
    isUserAdmin,
    isUserSeller,
    roleOptions,

    //action
    signUpUser,
    checkEmailExists,
    signInUser,
    signOutUser,
    initializeAuth,
  }
})
