<template>
    <div v-if="loading" class="d-flex justify-content-center align-items-center" style="height: 100vh;">
        <div class="spinner-border text-primary" role="status">

        </div>
        <span class="text-dark" v-if="themeStore.theme === 'light'">Loading...</span>
        <span class="text-light" v-else>Loading...</span>
    </div>


    <div v-else class="container py-5">
        <h2 class="mb-4 text-center">🏘️ {{ AuthStore.user.email }}'s Property Listings</h2>

        <!-- Add Property Button -->
        <div class="mb-3 text-end">
            <a href="#" class="btn btn-success" @click="addProperty">➕ Add Property</a>
        </div>

        <!-- Property Table -->
        <div class="table-responsive">
            <table class="table table-bordered table-hover align-middle">
                <thead class="table-light text-center">
                    <tr>
                        <th>Image</th>
                        <th>Type</th>
                        <th>Location</th>
                        <th>Details</th>
                        <th>Tags</th>
                        <th>Price</th>

                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>

                    <tr v-for="(property, id) in properties" :key="property.id">
                        <td><img :src="property.images[0]" :alt="property.title"
                                class="img-fluid rounded img-thumbnail img-width-300"></td>
                        <td>{{ property.propertyType }}</td>
                        <td>{{ property.location }}</td>
                        <td>Bedrooms: {{ property.bedrooms }}, Bathrooms: {{ property.bathrooms }}, Area: {{
                            property.area }} sqft</td>


                        <td>
                            <span class="badge bg-secondary" v-for="tag in property.tags" :key="tag">{{ tag }}</span>
                        </td>
                        <td><strong>{{ property.price }}$</strong></td>
                        <td class="text-center">
                            <button class="btn btn-light btn-sm me-1" @click="editProperty(property.id)">Edit</button>
                            <button class="btn btn-danger btn-sm"
                                @click="handlePropertyDeletion(property.id)">Delete</button>
                        </td>
                    </tr>

                </tbody>
            </table>
        </div>
    </div>
</template>
<script setup>
    import { useRouter, useRoute } from 'vue-router';
    import { App_Route_Names } from '@/constants/RouteNames';
    import propertyService from '@/services/propertyService';
    import { onMounted, ref } from 'vue';
    import { useThemeStore } from '@/stores/themeStore';
    import { useSwal } from '@/utility/useSwal';
    import { useAuthStore } from '@/stores/authStore';
    import userService from '@/services/userService';

    const themeStore = useThemeStore();
    const router = useRouter();
    const route = useRoute();
    const loading = ref(true);
    const AuthStore = useAuthStore();
    const { showConfirmation, showSuccess, showError } = useSwal();
    const properties = ref([]);
    const numberOfProperties = ref(0);



    const checkPropertiesLimit = async () => {
        try {
            if (AuthStore.user?.uid) {
                numberOfProperties.value = await propertyService.getNumberOfPropertiesByUserId(AuthStore.user.uid);
            }
        } catch (error) {
            console.error('Error getting number of properties:', error);
        }
    };


    const addProperty = async () => {
        await checkPropertiesLimit();

        if (!AuthStore.isAuthenticated) {
            router.push({ name: App_Route_Names.SIGN_IN });
            return;
        }
        const user = await userService.getUserById(AuthStore.user.uid);
        console.log('max Properties Allowed:', user.maxPropertiesAllowed);
        console.log('Number of properties:', numberOfProperties.value);

        if (numberOfProperties.value >= user.maxPropertiesAllowed) {
            showError('You have reached the maximum number of properties allowed', user.maxPropertiesAllowed, numberOfProperties.value);
            return;
        }

        router.push({ name: App_Route_Names.PROPERTY_CREATE });
    }

    onMounted(async () => {
        await checkPropertiesLimit()
        fetchProperties();

    });
    const fetchProperties = async () => {
        try {
            loading.value = true;
            if (!AuthStore.isAuthenticated) {
                throw new Error('User not authenticated or user ID not found');
            }
            console.log('Fetching properties for user:', AuthStore.user.uid);


            if (AuthStore.isUserAdmin) {

                properties.value = await propertyService.getProperties();
                console.log('All properties fetched:', numberOfProperties);
            } else {
                properties.value = await propertyService.getPropertiesByUserId(AuthStore.user.uid);

            }
        } catch (error) {
            console.error('Error fetching properties:', error);
        } finally {
            loading.value = false;
        }
    }
    const handlePropertyDeletion = (id) => {
        showConfirmation('Are you sure you want to delete this property?')
            .then((result) => {
                if (result.isConfirmed) {
                    deleteProperty(id);
                    showSuccess('Property deleted successfully!');
                }
            })
            .catch((error) => {
                console.error('Error during deletion confirmation:', error);
            });
    };
    const deleteProperty = async (id) => {
        try {
            loading.value = true;
            await propertyService.deleteProperty(id);
            properties.value = properties.value.filter((property) => property.id !== id);
        } catch (error) {
            console.error('Error deleting property:', error);
        } finally {
            loading.value = false;
        }
    }



    const editProperty = (id) => {
        console.log('Edit clicked for property id:', id);
        router.push({ name: App_Route_Names.PROPERTY_EDIT, params: { id } });
    }


</script>
<style scoped>
.img-width-300 {
    max-width: 300px;
    height: 200px;
    object-fit: cover;
}
</style>