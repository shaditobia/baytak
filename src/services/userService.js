import { firebaseDb } from '@/utility/firebaseConfig'
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

const userCollection = collection(firebaseDb, 'users')

export default {
  async createUser(userData) {
    const docRef = await addDoc(userCollection, userData)
    return { id: docRef.id, ...userData }
  },

  async getUsers() {
    const userSnapshot = await getDocs(userCollection)
    console.log(userSnapshot)
    return userSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
  },
  async getUserById(id) {
    const docRef = doc(firebaseDb, 'users', id)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() }
    } else {
      throw new Error('user not found')
    }
    س
  },
  async updateUser(id, userData) {
    const docRef = doc(firebaseDb, 'users', id)
    console.log(docRef)
    await updateDoc(docRef, userData)
    return { id, ...userData }
  },
  async deleteUser(id) {
    const docRef = doc(firebaseDb, 'users', id)
    await deleteDoc(docRef)
  },
  async setUser(id, userData) {
    const docRef = doc(firebaseDb, 'users', id)
    await setDoc(docRef, userData)
  },
  async getUserById(id) {
    const docRef = doc(firebaseDb, 'users', id)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() }
    } else {
      throw new Error('User not found')
    }
  },
}
