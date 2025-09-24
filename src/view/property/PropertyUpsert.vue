<template>
    <div class="container mt-5">

        <form v-on:submit.prevent="handleSubmit">
            <h2 class="mb-4">{{ propertyEditId ? 'Edit Property Listing' : 'Add Property Listing' }}</h2>
            <div v-if="errorList.length" class="alert alert-danger">
                <ul>
                    <li v-for="(error, index) in errorList" :key="index">{{ error }}</li>
                </ul>
            </div>
            <!-- Listing Type -->
            <div class="mb-3">
                <label for="listingType" class="form-label">Listing Type</label>
                <select class="form-select" id="listingType" v-model="propertyFormObj.listingType" required>
                    <option value="">Choose...</option>
                    <option v-for="type in LISTING_TYPES" :key="type" :value="type">{{ type }}
                    </option>
                </select>
            </div>

            <!-- Property Type -->
            <div class="mb-3">
                <label for="propertyType" class="form-label">Property Type</label>
                <select class="form-select" id="propertyType" v-model="propertyFormObj.propertyType" required>
                    <option value="">Choose...</option>
                    <option v-for="type in PROPERTY_TYPES" :key="type" :value="type">{{ type }}
                    </option>
                </select>
            </div>

            <!-- Location -->
            <div class="mb-3">
                <label for="location" class="form-label">Location</label>
                <input type="text" class="form-control" id="location" placeholder="City, Neighborhood" required
                    v-model="propertyFormObj.location">
            </div>

            <!-- Price -->
            <div class="mb-3">
                <label for="price" class="form-label">Price (USD)</label>
                <input type="number" class="form-control" id="price" required v-model="propertyFormObj.price">
            </div>

            <!-- Bedrooms & Bathrooms -->
            <div class="row mb-3">
                <div class="col">
                    <label for="bedrooms" class="form-label">Bedrooms</label>
                    <input type="number" class="form-control" id="bedrooms" required v-model="propertyFormObj.bedrooms">
                </div>
                <div class="col">
                    <label for="bathrooms" class="form-label">Bathrooms</label>
                    <input type="number" class="form-control" id="bathrooms" required
                        v-model="propertyFormObj.bathrooms">
                </div>
            </div>

            <!-- Area -->
            <div class="mb-3">
                <label for="area" class="form-label">Area (sq meters)</label>
                <input type="number" class="form-control" id="area" required v-model="propertyFormObj.area">
            </div>

            <!-- Description -->
            <div class="mb-3">
                <label for="description" class="form-label">Description</label>
                <textarea class="form-control" id="description" rows="4" placeholder="Describe the property..." required
                    v-model="propertyFormObj.description"></textarea>
            </div>
            <!-- Tags -->
            <div class="mb-3">
                <label for="tags" class="form-label">Tags</label>
                <input type="text" class="form-control" id="tags" placeholder="e.g. sea view, furnished, near metro"
                    v-model="propertyFormObj.tags">
                <div class="form-text">Separate tags with commas.</div>
            </div>


            <!-- Image Upload -->
            <div class="mb-3">
                <label for="images" class="form-label">Upload Images</label>
                <input class="form-control" type="file" id="images" multiple @change="handleImageUpload"
                    :disabled="isImageUploading" />
            </div>



            <!-- Contact Info -->
            <div class=" mb-3">
                <label for="contact" class="form-label">Contact Info</label>
                <input type="text" class="form-control" id="contact" placeholder="Phone or Email"
                    v-model="propertyFormObj.contact" required>
            </div>


            <!-- Submit Button -->
            <button type="submit" class="btn btn-primary" :disabled="loading || isImageUploading">Submit</button>

            <router-link type="button" class="btn btn-secondary"
                :to="{ name: App_Route_Names.PROPERTY_LIST }">Cancel</router-link>
        </form>
    </div>
    <!-- Loading Dialog -->
    <div v-if="loading" class="modal fade show d-block" tabindex="-1" style="background-color: rgba(0,0,0,0.5);">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content text-center p-4">
                <div class="spinner-border text-primary mb-3" role="status"></div>
                <h5 class="modal-title">Submitting Property...</h5>
            </div>
        </div>
    </div>



</template>
<script setup>
    import { reactive, ref, onMounted } from 'vue';
    import { useRouter, useRoute } from 'vue-router';
    import { PROPERTY_TYPES, LISTING_TYPES } from '@/constants/appConstants';
    import { useSwal } from '@/utility/useSwal';
    import propertyService from '@/services/propertyService';
    import { App_Route_Names } from '@/constants/RouteNames';
    import { uploadImageToCloudinary } from '@/utility/cloudinary';
    import { useAuthStore } from '@/stores/authStore';
    import userService from '@/services/userService';



    const authStore = useAuthStore();
    const swal = useSwal();
    const route = useRoute();
    const router = useRouter();
    const loading = ref(false);
    const isImageUploading = ref(false);

    const propertyEditId = ref(route.params.id);
    const errorList = reactive([]);
    const propertyFormObj = reactive({
        listingType: '',
        propertyType: '',
        location: '',
        price: 0,
        bedrooms: 0,
        bathrooms: 0,
        area: 0,
        description: '',
        tags: [],
        images: [],
        contact: '',


    });
    const numberOfPropertiesUser = ref(0);
    const checkPropertiesLimit = async () => {
        if (authStore.user?.uid) {
            numberOfPropertiesUser.value = await propertyService.getNumberOfPropertiesByUserId(authStore.user.uid);
        }
    };


    onMounted(async () => {
        if (!propertyEditId.value)
            return;
        loading.value = true;
        try {
            const property = await propertyService.getPropertyById(propertyEditId.value);
            if (property) {
                Object.assign(propertyFormObj, { ...property, tags: property.tags.join(', '), images: property.images || [defaultImage] });
            } else {
                swal.showError('Property not found!');
                router.push({ name: App_Route_Names.PROPERTY_LIST });
            }
        } catch (error) {
            console.error('Error fetching property:', error);
            swal.showError('Failed to fetch property details.');
        } finally {
            loading.value = false;
        }
    });


    const handleSubmit = async () => {

        // Handle form submission
        console.log('Form submitted:', propertyFormObj);
        //validations



        try {
            loading.value = true;

            if (!(propertyFormObj.price > 0))
                errorList.push('Price cannot be negative.');
            if (!(propertyFormObj.bedrooms >= 1))
                errorList.push('Bedrooms must be 1 or more.');
            if (!(propertyFormObj.bathrooms >= 1))
                errorList.push('Bathrooms must be 1 or more.');
            if (!(propertyFormObj.area >= 10))
                errorList.push('Area must be at least 10 square meters.');
            if ((propertyFormObj.images.length > 5))
                errorList.push('You can upload a maximum of 5 images.');
            if (errorList.length > 0) {
                console.error('Validation errors:', errorList);
                return;
            }
            const user = await userService.getUserById(authStore.user.uid);
            await checkPropertiesLimit();
            console.log('max Properties Allowed:', user.maxPropertiesAllowed);
            if (numberOfPropertiesUser.value >= user.maxPropertiesAllowed) {
                errorList.push(`You have reached the maximum number of properties allowed (${user.maxPropertiesAllowed}). Please delete some properties before adding new ones.`);
                return;
            }
            const propertyData = {
                ...propertyFormObj,
                price: propertyFormObj.price ? parseFloat(propertyFormObj.price) : null,
                tags: propertyFormObj.tags.length > 0 ? propertyFormObj.tags.split(',').map(tag => tag.trim()) : [],
                images: propertyFormObj.images.length > 0 ? propertyFormObj.images : [],
                userId: authStore.user.uid

            };

            if (propertyEditId.value) {
                // Update existing property
                await propertyService.updateProperty(propertyEditId.value, propertyData);
                swal.showSuccess('Property updated successfully!');
            } else {
                // Create new property

                await new Promise((resolve) => setTimeout(resolve, 2000));
                await propertyService.createProperty(propertyData);
                swal.showSuccess('Property created successfully!');
            }


            router.push({ name: App_Route_Names.PROPERTY_LIST })
            console.log('Property data ready for submission:', propertyData);
        }
        catch (e) { console.error('Error submitting form:', e); }
        finally {
            loading.value = false;
            // Reset form
            propertyFormObj.listingType = '';
            propertyFormObj.propertyType = '';
            propertyFormObj.location = '';
            propertyFormObj.price = 0;
            propertyFormObj.bedrooms = 0;
            propertyFormObj.bathrooms = 0;
            propertyFormObj.area = 0;
            propertyFormObj.description = '';
            propertyFormObj.tags = [];
            propertyFormObj.images = [];
            propertyFormObj.contact = '';
        }


    };
    const handleImageUpload = async (event) => {
        const files = event.target.files;
        if (files.length + propertyFormObj.images.length > 5) {
            swal.showError('You can upload a maximum of 5 images.');
            return;
        } else if (files.length > 0) {
            isImageUploading.value = true;
            try {
                const uploadedImages = await Promise.all(
                    Array.from(files).map(file => uploadImageToCloudinary(file))
                );
                propertyFormObj.images = [...propertyFormObj.images, ...uploadedImages];
            } catch (error) {
                console.error('Error uploading images:', error);
            } finally {
                isImageUploading.value = false;
            }
        }
    };
</script>