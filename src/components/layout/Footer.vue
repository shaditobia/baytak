<template>
    <footer class="bg-light text-center text-lg-start">
        <div class="text-center p-3" :class="themeStore.theme === 'dark' ? 'text-dark' : 'text-muted'">
            © 2025 Baytak. <i class="bi bi-buildings"></i> All rights reserved.
        </div>
    </footer>
</template>
<script setup>
    import { useThemeStore } from '@/stores/themeStore';
    const themeStore = useThemeStore();
</script>