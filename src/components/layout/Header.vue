<template>
    <nav class="navbar navbar-expand-lg bg-body-tertiary ">
        <div class="container-fluid"><a href="#"><img src="@/assets/dark-logo.png" alt="Logo" style="width: 150px;"
                    class="navbar-brand" /></a>

            <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
                data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false"
                aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                    <li class="nav-item">
                        <router-link class="nav-link active" aria-current="page"
                            :to="{ name: App_Route_Names.HOME }">Home</router-link>
                    </li>

                    <li class="nav-item">
                        <router-link class="nav-link" :to="{ name: App_Route_Names.PROPERTY_LIST }"
                            v-if="authStore.isAuthenticated && (authStore.roleOptions.includes('seller') || authStore.roleOptions.includes('admin'))">Property
                            List
                        </router-link>
                    </li>
                    <li class="nav-item"
                        v-if="authStore.isAuthenticated && (authStore.roleOptions.includes('seller') || authStore.roleOptions.includes('admin'))">
                        <router-link class="nav-link" :to="{ name: App_Route_Names.PROPERTY_CREATE }">Add Property
                        </router-link>
                    </li>
                    <li class="nav-item">
                        <router-link class="nav-link" :to="{ name: App_Route_Names.CONTACT_US }">Contact
                            Us</router-link>
                    </li>
                    <li class="nav-item" v-if="authStore.isAuthenticated && authStore.roleOptions.includes('admin')">
                        <router-link class="nav-link" :to="{ name: App_Route_Names.USERS_SETTINGS }">User
                            Settings</router-link>
                    </li>


                </ul>
                <ul class="navbar-nav d-flex flex-row align-items-center">
                    <li class="nav-item" v-if="authStore.isAuthenticated"> Welcome {{ authStore.user.email }}</li>
                    <li class="nav-item dropdown">
                        <button class="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown"
                            aria-expanded="false">
                            <i class="bi bi-laptop"></i>
                        </button>

                        <ul class="dropdown-menu">
                            <li><a class="dropdown-item" href="#" @click="themeStore.setTheme('light')"><i
                                        class="bi bi-brightness-high"></i> Light</a></li>
                            <li><a class="dropdown-item" href="#" @click="themeStore.setTheme('dark')"><i
                                        class="bi bi-moon-stars-fill"></i> Dark</a></li>
                        </ul>
                    </li>
                    <li class="nav-item" v-if="!authStore.isAuthenticated">
                        <router-link class="nav-link" :to="{ name: App_Route_Names.SIGN_IN }">Login</router-link>
                    </li>
                    <li class=" nav-item" v-else>
                        <button class="nav-link"
                            @click="[authStore.signOutUser(), router.push({ name: App_Route_Names.HOME })]">Logout</button>

                    </li>

                    <li class="nav-item" v-if="!authStore.isAuthenticated">
                        <router-link class="nav-link" :to="{ name: App_Route_Names.SIGN_UP }">Register</router-link>
                    </li>

                </ul>
            </div>
        </div>
    </nav>
</template>
<script setup>
    import { App_Route_Names } from '@/constants/RouteNames';
    import { useRouter } from 'vue-router';
    import { useThemeStore } from '@/stores/themeStore';
    import { useAuthStore } from '@/stores/authStore';

    const router = useRouter();
    const themeStore = useThemeStore();
    const authStore = useAuthStore();

</script>
