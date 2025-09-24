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
  query,
  where,
} from 'firebase/firestore'

const propertyCollection = collection(firebaseDb, 'properties')

export default {
  async createProperty(propertyData) {
    const docRef = await addDoc(propertyCollection, propertyData)
    return { id: docRef.id, ...propertyData }
  },

  async getProperties() {
    const propertySnapshot = await getDocs(propertyCollection)
    return propertySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
  },

  async getPropertyById(id) {
    const docRef = doc(firebaseDb, 'properties', id)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() }
    } else {
      throw new Error('Property not found')
    }
  },

  async updateProperty(id, propertyData) {
    const docRef = doc(firebaseDb, 'properties', id)
    await updateDoc(docRef, propertyData)
    return { id, ...propertyData }
  },

  async deleteProperty(id) {
    const docRef = doc(firebaseDb, 'properties', id)
    await deleteDoc(docRef)
  },

  async setDoc(id, propertyData) {
    const docRef = doc(firebaseDb, 'properties', id)
    await setDoc(docRef, propertyData)
  },

  async getPropertiesByUserId(userId) {
    try {
      if (!userId) {
        throw new Error('User ID is required to fetch properties')
      }
      console.log('Fetching properties for userId:', userId)
      const q = query(propertyCollection, where('userId', '==', userId))
      const propertySnapshot = await getDocs(q)
      return propertySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
    } catch (error) {
      console.error('Error fetching properties by userId:', error)
      throw error
    }
  },
  async getNumberOfPropertiesByUserId(userId) {
    try {
      if (!userId) {
        throw new Error('User ID is required to count properties')
      }

      console.log('Counting properties for userId:', userId)
      const q = query(propertyCollection, where('userId', '==', userId))
      const propertySnapshot = await getDocs(q)

      const count = propertySnapshot.docs.length
      console.log(`User ${userId} has ${count} properties`)
      return count
    } catch (error) {
      console.error('Error counting properties by userId:', error)
      throw error
    }
  },
}
