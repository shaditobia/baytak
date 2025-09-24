import { createRouter, createWebHistory } from 'vue-router'
import home from '../view/home/Home.vue'
import AccessDenied from '@/view/auth/AccessDenied.vue'
import NotFound from '@/view/auth/NotFound.vue'
import SignIn from '@/view/auth/SignIn.vue'
import SignUp from '@/view/auth/SignUp.vue'
import ContactUs from '@/view/home/CountactUs.vue'
import PropertyList from '@/view/property/PropertyList.vue'
import PropertyDetails from '@/view/property/PropertyDetails.vue'
import PropertyUpsert from '@/view/property/PropertyUpsert.vue'
import { App_Route_Names } from '../constants/RouteNames.js'
import { useAuthStore } from '@/stores/authStore'
import USERS_SETTINGS from '@/view/home/UsersSettings.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: App_Route_Names.HOME,
      component: home,
    },
    {
      path: '/access-denied',
      name: App_Route_Names.ACCESS_DENIED,
      component: AccessDenied,
    },
    {
      path: '/not-found',
      name: App_Route_Names.NOT_FOUND,
      component: NotFound,
    },
    {
      path: '/sign-in',
      name: App_Route_Names.SIGN_IN,
      component: SignIn,
    },
    {
      path: '/sign-up',
      name: App_Route_Names.SIGN_UP,
      component: SignUp,
    },
    {
      path: '/contact-us',
      name: App_Route_Names.CONTACT_US,
      component: ContactUs,
    },
    {
      path: '/property-list',
      name: App_Route_Names.PROPERTY_LIST,
      component: PropertyList,
    },
    {
      path: '/property-details/:id',
      name: App_Route_Names.PROPERTY_DETAILS,
      component: PropertyDetails,
    },
    {
      path: '/property-create/:id?',
      name: App_Route_Names.PROPERTY_CREATE,
      component: PropertyUpsert,
      beforeEnter: [isSeller || isAdmin],
    },
    {
      path: '/property-edit/:id',
      name: App_Route_Names.PROPERTY_EDIT,
      component: PropertyUpsert,
      beforeEnter: [isSeller || isAdmin],
    },
    {
      path: '/users-settings',
      name: App_Route_Names.USERS_SETTINGS,
      component: USERS_SETTINGS,
      beforeEnter: [isAdmin],
    },
    {
      path: '/property-details/:id',
      name: App_Route_Names.PROPERTY_DETAILS,
      component: PropertyDetails,
    },
  ],
})
router.beforeEach(async (to, from) => {
  const authStore = useAuthStore()
  if (!authStore.initialized) {
    await authStore.initializeAuth()
  }
})

function isAdmin() {
  const authStore = useAuthStore()
  console.log('isAdmin check:', authStore.isAuthenticated, authStore.isUserAdmin)
  if (authStore.isAuthenticated) {
    if (authStore.isUserAdmin) {
      return true
    } else {
      return { name: App_Route_Names.ACCESS_DENIED }
    }
  } else {
    return { name: App_Route_Names.SIGN_IN }
  }
}
function isSeller() {
  const authStore = useAuthStore()
  if (!authStore.isAuthenticated) {
    return { name: App_Route_Names.SIGN_IN }
  }
  if (authStore.isUserSeller || authStore.isUserAdmin) {
    return true
  } else {
    return { name: App_Route_Names.ACCESS_DENIED }
  }
}

export default router
