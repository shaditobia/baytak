<template>
    <div class="container py-5">
        <h2 class="mb-4">إعدادات المستخدم</h2>
        <button class="btn btn-primary mb-3" @click="router.push({ name: App_Route_Names.SIGN_UP })">
            Add User </button>
        <div v-if="loading" class="text-center my-5">
            <div class="spinner-border" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>

        <div class="table-responsive" v-else>
            <table class="table table-bordered table-hover align-middle">
                <thead class="table-light text-center">
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Max Properties Allowed</th>
                        <th>Actions</th>

                    </tr>
                </thead>
                <tbody>
                    <tr v-for="user in users" :key="user.id">

                        <td>{{ user.firstName }}</td>
                        <td>{{ user.email }}</td>
                        <td>{{ user.role }}</td>

                        <td><input type="text" v-model="user.maxPropertiesAllowed" disabled />
                        </td>

                        <td>
                            <button class="btn btn-sm btn-warning me-2" @click="editUser(user)">Edit</button>

                        </td>

                    </tr>
                </tbody>
            </table>

            <!-- إضافة / تعديل المستخدم Modal -->
            <div class="modal" tabindex="-1" :class="{ 'show d-block': showAddUserModal }">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">{{ editingUser ? "Edit User" : "Add User" }}</h5>
                            <button type="button" class="btn-close" @click="closeModal"></button>
                        </div>
                        <div class="modal-body">
                            <form @submit.prevent="saveUser">
                                <div class="mb-3">
                                    <label for="name" class="form-label">Name</label>
                                    <input type="text" class="form-control" id="name" v-model="currentUser.firstName"
                                        required>
                                </div>
                                <div class="mb-3">
                                    <label for="email" class="form-label">Email</label>
                                    <input type="email" class="form-control" id="email" v-model="currentUser.email"
                                        required>
                                </div>
                                <div class="mb-3">
                                    <label for="role" class="form-label">Role</label>
                                    <select class="form-select" id="role" v-model="currentUser.role" required>
                                        <option v-for="role in RULE_TYPES" :key="role" :value="role">{{ role }}</option>
                                    </select>
                                </div>
                                <div class="mb-3">
                                    <label for="maxPropertiesAllowed" class="form-label">Max Properties Allowed</label>
                                    <input type="number" class="form-control" id="maxPropertiesAllowed"
                                        v-model.number="currentUser.maxPropertiesAllowed" min="1" required>
                                </div>
                                <button type="submit" class="btn btn-primary">
                                    {{ editingUser ? 'Update' : 'Add' }}
                                </button>
                                <button type="button" class="btn btn-secondary ms-2" @click="closeModal">Cancel</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { ref, onMounted } from 'vue';
    import { App_Route_Names } from '@/constants/RouteNames';
    import userService from '@/services/userService';

    import { RULE_TYPES } from '@/constants/appConstants';
    import router from '@/router/routes';




    // Reactive state
    const loading = ref(true);
    const firebaseConnected = ref(false);
    const showAddUserModal = ref(false);
    const showDeleteModal = ref(false);
    const editingUser = ref(false);

    const users = ref([]);



    const currentUser = ref({
        id: null,
        firstName: '',
        email: '',
        role: '',
        maxPropertiesAllowed: 2,



    });

    // Methods



    const fetchUsers = async () => {
        loading.value = true;
        try {
            const data = await userService.getUsers();
            users.value = data;
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            loading.value = false;
            firebaseConnected.value = true;
        }
    };



    const editUser = (user) => {
        currentUser.value = { ...user };
        editingUser.value = true;
        showAddUserModal.value = true;
    };






    const saveUser = async () => {
        try {
            if (editingUser.value) {
                // Update existing user
                await userService.updateUser(currentUser.value.id, currentUser.value);
            } else {
                // Add new user
                console.log('Adding user:', currentUser.value);
            }
        } catch (error) {
            console.error('Error saving user:', error);
        } finally {
            closeModal();
            fetchUsers();
        }
    };


    const closeModal = () => {
        showAddUserModal.value = false;
        showDeleteModal.value = false;
        editingUser.value = false;
        currentUser.value = {
            id: null,
            name: '',
            email: '',
            role: '',

        };
    };

    onMounted(() => {
        fetchUsers();
    });


</script>
