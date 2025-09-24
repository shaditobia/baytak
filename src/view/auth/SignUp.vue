<template>
    <div class="container d-flex justify-content-center align-items-center vh-100">
        <div class="col-md-6">
            <div class="card shadow-lg p-4 rounded-3">
                <h1 class="text-center mb-4">Sign Up</h1>



                <div v-if="errorList.length" class="alert alert-danger">
                    <ul class="mb-0">
                        <li v-for="(err, index) in errorList" :key="index">{{ err }}</li>
                    </ul>
                </div>

                <form @submit.prevent="handleSignUp">
                    <div class="mb-3">
                        <label for="firstName" class="form-label">First Name:</label>
                        <input type="text" id="firstName" v-model="userInfo.firstName" class="form-control"
                            placeholder="Enter your first name" />
                    </div>

                    <div class="mb-3">
                        <label for="lastName" class="form-label">Last Name:</label>
                        <input type="text" id="lastName" v-model="userInfo.lastName" class="form-control"
                            placeholder="Enter your last name" />
                    </div>

                    <div class="mb-3">
                        <label for="birth" class="form-label">Birth Date:</label>
                        <input type="date" id="birth" v-model="userInfo.birth" class="form-control" />
                    </div>

                    <div class="mb-3">
                        <label for="email" class="form-label">Email:</label>
                        <input type="email" id="email" v-model="userInfo.email" class="form-control"
                            placeholder="Enter your email" @blur="checkEmail" />
                    </div>

                    <div class="mb-3">
                        <label for="phone" class="form-label">Phone:</label>
                        <input type="tel" id="phone" v-model="userInfo.phone" class="form-control"
                            placeholder="Enter your phone number" />
                    </div>

                    <div class="mb-3">
                        <label for="role" class="form-label">Role:</label>
                        <select id="role" v-model="userInfo.role" class="form-select">
                            <option value="" disabled>Select your role</option>
                            <option :value="RULE_TYPES[0]">Seler</option>
                            <option :value="RULE_TYPES[1]">Bayer</option>
                        </select>
                    </div>

                    <div class="mb-3">
                        <label for="password" class="form-label">Password:</label>
                        <input type="password" id="password" v-model="userInfo.password" class="form-control"
                            placeholder="Enter your password" />
                    </div>

                    <div class="mb-3">
                        <label for="confirmPassword" class="form-label">Confirm Password:</label>
                        <input type="password" id="confirmPassword" v-model="userInfo.confirmPassword"
                            class="form-control" placeholder="Confirm your password" />
                    </div>

                    <button type="submit" class="btn w-100 btn-main mb-3" :disabled="authStore.loading"><span
                            class="spinner-border spinner-border-sm me-2 " v-if="authStore.loading"></span> Sign
                        Up</button>
                </form>

                <div class="text-center">
                    <span class="text-muted">
                        Already have an account?
                        <router-link :to="{ name: App_Route_Names.SIGN_IN }" class="text-primary fw-bold">Login
                            here</router-link>
                    </span>
                </div>
            </div>

        </div>
    </div>
</template>

<script setup>
    import { reactive, ref } from 'vue';
    import { App_Route_Names } from '@/constants/RouteNames';
    import { RULE_TYPES } from '@/constants/appConstants';
    import { useSwal } from '@/utility/useSwal';
    const { showSuccess, showError } = useSwal();
    import { useAuthStore } from '@/stores/authStore';
    import { useRouter } from 'vue-router';
    import userService from '@/services/userService';
    const router = useRouter();

    const userInfo = reactive({
        firstName: '',
        lastName: '',
        birth: '',
        email: '',
        phone: '',
        role: '',
        maxPropertiesAllowed: 2,
        password: '',
        confirmPassword: ''
    });
    const authStore = useAuthStore();
    const errorList = ref([]);

    // const userEditId = ref(route.params.id);

    const handleSignUp = async () => {
        errorList.value = [];



        if (!userInfo.firstName) errorList.value.push('First Name is required.');
        if (!userInfo.lastName) errorList.value.push('Last Name is required.');
        if (!userInfo.birth) errorList.value.push('Birth Date is required.');
        if (!userInfo.email) errorList.value.push('Email is required.');
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userInfo.email)) errorList.value.push('Email is invalid.');

        if (!userInfo.phone) errorList.value.push('Phone is required.');
        else if (!/^[0-9]{6,15}$/.test(userInfo.phone)) errorList.value.push('Phone number is invalid.');

        if (!userInfo.role) errorList.value.push('Role is required.');

        if (!userInfo.password) {
            errorList.value.push('Password is required.')
        } else {
            if (userInfo.password.length < 6) {
                errorList.value.push('Password must be at least 6 characters long.')
            }
            if (!/[A-Z]/.test(userInfo.password)) {
                errorList.value.push('Password must contain at least one uppercase letter.')
            }
            if (!/[a-z]/.test(userInfo.password)) {
                errorList.value.push('Password must contain at least one lowercase letter.')
            }
            if (!/[0-9]/.test(userInfo.password)) {
                errorList.value.push('Password must contain at least one number.')
            }
            if (!/[^A-Za-z0-9]/.test(userInfo.password)) {
                errorList.value.push('Password must contain at least one special character.')
            }
        }

        if (!userInfo.confirmPassword) {
            errorList.value.push('Confirm Password is required.')
        } else if (userInfo.password && userInfo.confirmPassword && userInfo.password !== userInfo.confirmPassword) {
            errorList.value.push('Passwords do not match.')
        }

        if (userInfo.email) {
            const exists = await authStore.checkEmailExists(userInfo.email)
            if (exists) {
                errorList.value.push('Email already exists');
            }
        }


        if (errorList.value.length) return;

        try {
            //          await new Promise((resolve) => setTimeout(resolve, 4000));
            await authStore.signUpUser(userInfo.email, userInfo.password);

            if (authStore.error) {
                showError(authStore.error);
                return;
            }

            await userService.setUser(authStore.user.uid, {
                ...userInfo,
                uid: authStore.user.uid
            });

            showSuccess('User registered successfully!');
            router.push({ name: App_Route_Names.SIGN_IN });

        } catch (err) {
            errorList.value = [err.message];
            console.log(err.message);
            showError(err.message);
        } finally {
            // clear form fields
            userInfo.firstName = '';
            userInfo.lastName = '';
            userInfo.birth = '';
            userInfo.email = '';
            userInfo.phone = '';
            userInfo.role = '';
            userInfo.password = '';
            userInfo.confirmPassword = '';

        }
    };

</script>

<style scoped>
.btn-main {
    background-color: rgb(74, 176, 224);
    color: #fff;
}

.btn-main:hover {
    background-color: rgb(64, 156, 204);
    color: #fff;
}
</style>
