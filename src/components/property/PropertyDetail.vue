<template>
    <div class="modal fade" :id="`propertyDetailsModal-${property.id}`" tabindex="-1">
        <div class="modal-dialog modal-lg modal-dialog-centered">
            <div class="modal-content shadow-lg rounded border-0 modal-bg">

                <!-- Header -->
                <div class="modal-header bg-primary text-white">
                    <h5 class="modal-title">🏠 {{ property.propertyType }} Details</h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"
                        aria-label="Close"></button>
                </div>

                <!-- Body -->
                <div class="modal-body">
                    <PropertyCarousel :images="property.images" :propertyId="property.id" />

                    <!-- التفاصيل تحت الصورة -->
                    <div>
                        <h5 class="fw-bold">🏠 {{ property.propertyType }}</h5>
                        <p class="mb-2"><strong>📍 Location:</strong> {{ property.location }}</p>
                        <p class="mb-2"><strong>💵 Price:</strong> ${{ property.price }}</p>
                        <p class="mb-2"><strong>🛏️ Bedrooms:</strong> {{ property.bedrooms }}</p>
                        <p class="mb-2"><strong>🛁 Bathrooms:</strong> {{ property.bathrooms }}</p>
                        <p class="mb-2"><strong>📐 Area:</strong> {{ property.area }} m²</p>

                        <!-- Tags -->
                        <div class="mb-2">
                            <span class="badge feature-badge me-1" v-for="tag in property.tags" :key="tag">{{ tag
                                }}</span>
                        </div>

                        <!-- Description -->
                        <div v-if="property.description">
                            <h6>📝 Description</h6>
                            <p>{{ property.description }}</p>
                        </div>
                        <p class="contact h6"><strong>📞 Contact: </strong>{{ property.contact }}</p>
                    </div>
                </div>

                <!-- Footer -->
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">❌ Close</button>
                    <button type="button" class="btn btn-primary" @click="contractUs" data-bs-dismiss="modal">📞
                        Contract us</button>
                </div>

            </div>
        </div>
    </div>
</template>

<script setup>
    import router from '@/router/routes';
    import { App_Route_Names } from '@/constants/RouteNames';
    import PropertyCarousel from './PropertyCarousel.vue';

    const props = defineProps({
        property: { type: Object, required: true }
    })


    const contractUs = () => {
        router.push({ name: App_Route_Names.CONTACT_US });
    }
</script>

<style scoped>
.modal-bg {
    background-color: var(--bs-body-bg);
    color: var(--bs-body-color);
}

.feature-badge {
    background-color: var(--bs-info-bg);
    color: var(--bs-body-color);
    font-size: 0.75rem;
    padding: 0.35em 0.6em;
    border-radius: 0.5rem;
}

.modal-header,
.modal-footer {
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.modal-footer {
    border-top: none;
}

.btn-primary {
    background-color: var(--bs-primary);
    border: none;
    color: #fff;
}

.btn-primary:hover {
    background-color: #0a58ca;
}

.btn-secondary {
    background-color: var(--bs-secondary);
    border: none;
    color: #fff;
}

.btn-secondary:hover {
    background-color: #6c757d;
}
</style>
