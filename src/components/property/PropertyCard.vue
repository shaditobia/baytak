<template>
    <div class="col-md-6 col-lg-4 mb-4">
        <div class="card modern-card h-100">



            <PropertyCarousel :images="property.images" :propertyId="property.id" />


            <div class="card-body">
                <h5 class="card-title fw-bold">🏠 {{ property.propertyType }}</h5>
                <p class="card-text small">
                    <strong>📍 Location:</strong> {{ property.location }}<br />
                    <strong>🛏️ Details:</strong> {{ property.bedrooms }} Bedrooms, {{ property.bathrooms }} Bathrooms,
                    {{ property.area }} m²
                </p>

                <div class="mb-3">
                    <span class="badge feature-badge me-1" v-for="tag in property.tags" :key="tag">{{ tag }}</span>
                </div>

                <p class="price h6"><strong>💵 Price:</strong> {{ property.price }}</p>
            </div>


            <div class="card-footer bg-transparent border-0 d-flex justify-content-between">
                <button class="btn btn-sm btn-view" data-bs-toggle="modal"
                    :data-bs-target="`#propertyDetailsModal-${property.id}`" ref="viewBtn">
                    🔍 View
                </button>
                <button class="btn btn-sm btn-edit" @click="editProperty(property.id)"
                    v-if="AuthStore.isAuthenticated">✏️
                    Edit</button>
                <button class="btn btn-sm btn-delete" @click="deleteProperty(property.id)"
                    v-if="AuthStore.isAuthenticated">🗑️ Delete</button>
            </div>
        </div>

        <PropertyDetail :property="property" @edit="editProperty" />
    </div>
</template>


<script setup>
    import { onMounted } from 'vue';
    import PropertyDetail from './PropertyDetail.vue'
    import PropertyCarousel from './PropertyCarousel.vue'
    import { useAuthStore } from '@/stores/authStore';

    const AuthStore = useAuthStore();

    const props = defineProps({
        property: { type: Object, required: true },
        deleteProperty: { type: Function, required: true },
        editProperty: { type: Function, required: true }
    })
    onMounted(() => {
        console.log('PropertyCard mounted with property:', props.property);
        console.log('Is user authenticated:', AuthStore.isAuthenticated);
    });
</script>

<style scoped>
.modern-card {
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    border: 1px solid var(--bs-border-color);
    border-radius: 0.75rem;
    background-color: var(--bs-card-bg);
    color: var(--bs-card-color);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.modern-card:hover {
    transform: translateY(-6px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25);
}

.feature-badge {
    background-color: var(--bs-secondary-bg);
    color: var(--bs-body-color);
    font-size: 0.75rem;
    padding: 0.35em 0.6em;
    border-radius: 6px;
}

.price {
    font-size: 1rem;
    font-weight: bold;
    color: var(--bs-success);
}

.btn-view {
    background-color: var(--bs-primary);
    border: none;
    color: #fff;
}

.btn-view:hover {
    background-color: #0a58ca;
}

.btn-edit {
    background-color: var(--bs-warning);
    border: none;
    color: #000;
}

.btn-edit:hover {
    background-color: #e0a800;
    color: #000;
}

.btn-delete {
    background-color: var(--bs-danger);
    border: none;
    color: #fff;
}

.btn-delete:hover {
    background-color: #bb2d3b;
}
</style>
