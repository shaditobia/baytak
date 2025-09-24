<template>
    <div v-if="images.length" :id="carouselId" class="carousel slide" ref="carouselRef">
        <div class="carousel-inner">
            <div v-for="(img, index) in images" :key="index" :class="['carousel-item', { active: index === 0 }]">
                <img :src="img" class="d-block w-100" alt="Property Image" />
            </div>
        </div>
        <button class="carousel-control-prev" type="button" :data-bs-target="'#' + carouselId" data-bs-slide="prev">
            <span class="carousel-control-prev-icon"></span>
        </button>
        <button class="carousel-control-next" type="button" :data-bs-target="'#' + carouselId" data-bs-slide="next">
            <span class="carousel-control-next-icon"></span>
        </button>
    </div>
    <div v-else>
        <img src="@/assets/placeholder.png" class="img-fluid rounded-top" alt="Placeholder" />
    </div>
</template>

<script setup>
    import { ref, onMounted, computed } from 'vue';
    import * as bootstrap from 'bootstrap';

    const uniqueId = Math.random().toString(36).substring(2, 9);



    const props = defineProps({
        images: { type: Array, default: () => [] },
        propertyId: { type: String, required: true },
    });

    const carouselRef = ref(null);

    const carouselId = computed(() => `carousel-${props.propertyId}-${uniqueId}`);

    onMounted(() => {
        if (carouselRef.value) {
            new bootstrap.Carousel(carouselRef.value, {
                interval: 5000,
                ride: 'carousel',
            });
        }
    });
</script>

<style scoped>
.carousel-item img {

    object-fit: cover;
    border-top-left-radius: 0.75rem;
    border-top-right-radius: 0.75rem;
}
</style>
