<template>
    <!-- 🌟 Hero Section -->
    <div :class="[
        'p-5 rounded mb-5 text-center shadow-sm',
        themeStore.theme === 'dark' ? 'bg-dark text-light' : 'bg-light text-dark'
    ]">
        <h1 class="display-5 fw-bold" :style="{ color: themeStore.theme === 'dark' ? '#4ab0e0' : '#2894cb' }">
            🏡 Find Your Dream Property
        </h1>
        <p class="lead" :class="themeStore.theme === 'dark' ? 'text-light' : 'text-muted'">
            Browse listings and discover your next home, office, or investment.
        </p>

        <!-- 🔍 Search Input -->
        <div class="input-group mt-4 w-75 mx-auto">
            <input type="text" class="form-control" v-model="searchQuery"
                placeholder="Search by location, type, or tag..." :style="{
                    border: '2px solid #2894cb',
                    backgroundColor: themeStore.theme === 'dark' ? '#2a2a2a' : 'white',
                    color: themeStore.theme === 'dark' ? '#f0f0f0' : '#000'
                }" />
            <button class="btn" :style="{
                backgroundColor: '#2894cb',
                color: themeStore.theme === 'dark' ? '#121212' : 'white'
            }">
                Search
            </button>
        </div>
    </div>

    <!-- 🔃 Filters & Sort -->
    <div class="container mb-4">
        <div class="row align-items-center g-3">

            <!-- Dropdowns -->
            <div class="col-md-6 d-flex gap-2">
                <!-- 🏷️ Type -->
                <div class="dropdown">
                    <button class="btn dropdown-toggle" type="button" data-bs-toggle="dropdown" :style="{
                        border: '2px solid #2894cb',
                        color: '#2894cb',
                        backgroundColor: themeStore.theme === 'dark' ? '#1e1e1e' : '#e6f4fc'
                    }">
                        🏷️ Type
                    </button>
                    <ul class="dropdown-menu">
                        <li v-for="(propertytype, index) in propertyList" :key="index">
                            <a class="dropdown-item" href="#" @click.prevent="selectedPropertyType = propertytype">
                                {{ propertytype }}
                            </a>
                        </li>
                    </ul>
                </div>

                <!-- 📋 Listing -->
                <div class="dropdown">
                    <button class="btn dropdown-toggle" type="button" data-bs-toggle="dropdown" :style="{
                        border: '2px solid #2894cb',
                        color: '#2894cb',
                        backgroundColor: themeStore.theme === 'dark' ? '#1e1e1e' : '#e6f4fc'
                    }">
                        📋 Listing
                    </button>
                    <ul class="dropdown-menu">
                        <li v-for="(propertylisting, index) in listingList" :key="index">
                            <a class="dropdown-item" href="#" @click.prevent="selectedListingType = propertylisting">
                                {{ propertylisting }}
                            </a>
                        </li>
                    </ul>
                </div>
            </div>

            <!-- Filters -->
            <div class="col-md-6">
                <div class="row g-2">
                    <div class="col-md-4">
                        <input type="text" class="form-control" v-model="locationQuery"
                            placeholder="Filter by location..." />
                    </div>
                    <div class="col-md-3">
                        <input type="number" class="form-control" v-model.number="minPrice" placeholder="Min price" />
                    </div>
                    <div class="col-md-3">
                        <input type="number" class="form-control" v-model.number="maxPrice" placeholder="Max price" />
                    </div>
                    <div class="col-md-2">
                        <button class="btn btn-outline-secondary w-100 h-100"
                            @click="sortOrder = sortOrder === 'asc' ? 'desc' : 'asc'">
                            {{ sortOrder === 'asc' ? '⬆️ Asc' : '⬇️ Desc' }}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- 🏘️ Property Listings -->
    <div class="container py-5">
        <h2 class="mb-4 text-center" :style="{ color: themeStore.theme === 'dark' ? '#2ecc71' : '#27ae60' }">
            🏘️ Property Listings
        </h2>

        <div v-if="filteredProperties.length > 0" class="row">
            <PropertyCard v-for="property in filteredProperties" :key="property.id" :property="property"
                :deleteProperty="deleteProperty" :editProperty="editProperty" />
        </div>
        <div v-else class="text-center">
            There are no properties to display
        </div>
    </div>
</template>


<script setup>
    import { useRouter } from 'vue-router';
    import { App_Route_Names } from '@/constants/RouteNames';
    import propertyService from '@/services/propertyService';
    import { computed, onMounted, ref } from 'vue';
    import { useThemeStore } from '@/stores/themeStore';
    import PropertyCard from '@/components/property/PropertyCard.vue';
    import { PROPERTY_TYPES, LISTING_TYPES } from '@/constants/appConstants';
    import { useSwal } from '@/utility/useSwal';

    const selectedPropertyType = ref('All');
    const propertyList = ref(['All', ...PROPERTY_TYPES]);

    const selectedListingType = ref('All');
    const listingList = ref(['All', ...LISTING_TYPES]);

    const searchQuery = ref('');
    const themeStore = useThemeStore();
    const router = useRouter();
    const loading = ref(true);
    const locationQuery = ref('');
    const minPrice = ref(null);
    const maxPrice = ref(null);

    const { showConfirmation, showSuccess } = useSwal();
    const properties = ref([]);


    const sortOrder = ref('asc');

    const addProperty = () => {
        router.push({ name: App_Route_Names.PROPERTY_CREATE });
    };

    onMounted(async () => {
        fetchProperties();
    });

    const fetchProperties = async () => {
        try {
            loading.value = true;
            properties.value = await propertyService.getProperties();
        } catch (error) {
            console.error('Error fetching properties:', error);
        } finally {
            loading.value = false;
        }
    };

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
            properties.value = properties.value.filter(
                (property) => property.id !== id
            );
        } catch (error) {
            console.error('Error deleting property:', error);
        } finally {
            loading.value = false;
        }
    };

    const editProperty = (id) => {
        router.push({ name: App_Route_Names.PROPERTY_EDIT, params: { id } });
    };


    const filteredProperties = computed(() => {
        let result = properties.value.filter((property) => {
            const price = Number(property.price) || 0; // 🔹 تأكدنا انه رقم

            const matchType =
                selectedPropertyType.value === 'All' ||
                property.propertyType === selectedPropertyType.value;

            const matchListing =
                selectedListingType.value === 'All' ||
                property.listingType === selectedListingType.value;

            const matchSearch =
                searchQuery.value.trim() === '' ||
                Object.values(property).some((val) =>
                    String(val).toLowerCase().includes(searchQuery.value.toLowerCase())
                );

            const matchLocation =
                locationQuery.value.trim() === '' ||
                property.location?.toLowerCase().includes(locationQuery.value.toLowerCase());

            const matchPrice =
                (minPrice.value === null || price >= minPrice.value) &&
                (maxPrice.value === null || price <= maxPrice.value);


            // if (searchQuery.value) {
            //     tempQuery = tempQuery.filter((item) => {
            //         return item.name.toLowerCase().includes(searchQuery.toLowerCase());

            //     });
            // }

            return matchType && matchListing && matchSearch && matchLocation && matchSearch;
        });


        result.sort((a, b) => {
            if (sortOrder.value === 'asc') {
                return Number(a.price) - Number(b.price);
            } else {
                return Number(b.price) - Number(a.price);
            }
        });

        return result;
    });


</script>
