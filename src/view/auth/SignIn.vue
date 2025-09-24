<template>
    <div class="container d-flex justify-content-center align-items-center vh-100">
        <div class="col-md-4">

            <div class="card shadow-lg p-4 rounded-3">
                <h1 class="text-center mb-4">Sign In</h1>

                <!-- ✅ Form مع حدث submit -->
                <form @submit.prevent="handlSignIn">
                    <div class="mb-3">
                        <label for="email" class="form-label">Email:</label>
                        <input type="email" id="email" v-model="userInfo.email" class="form-control"
                            placeholder="Enter your email" required />
                    </div>

                    <div class="mb-3">
                        <label for="password" class="form-label">Password:</label>
                        <input type="password" id="password" v-model="userInfo.password" class="form-control"
                            placeholder="Enter your password" required />
                    </div>

                    <button type="submit" class="btn w-100 btn-main mb-3"><span
                            class="spinner-border spinner-border-sm me-2 " v-if="authStore.loading"></span>
                        Sign In
                    </button>
                </form>

                <div class="text-center my-2">
                    <span class="text-muted">or</span>
                </div>

                <div class="d-grid">
                    <router-link :to="{ name: App_Route_Names.SIGN_UP }" class="btn btn-outline-main w-100">
                        Register
                    </router-link>
                </div>
            </div>
        </div>
        <div v-if="error" class="alert alert-danger">
            {{ error }}
        </div>
    </div>
</template>

<script setup>
    import { reactive, ref } from "vue";
    import { App_Route_Names } from "@/constants/RouteNames";
    import { useRouter } from "vue-router";
    import { useSwal } from "@/utility/useSwal";
    import { useAuthStore } from "@/stores/authStore";


    const authStore = useAuthStore();
    const router = useRouter();
    const { showSuccess, showError } = useSwal();

    const userInfo = reactive({
        email: "",
        password: "",
    });

    const error = ref('');

    const handlSignIn = async () => {

        if (!userInfo.email || !userInfo.password) {
            showError("Please enter both email and password");
            error.value = "Please enter both email and password";
            return;
        }


        try {
            await authStore.signInUser(userInfo.email, userInfo.password);

            showSuccess('Sign in successfully');



            console.log('User info:', userInfo);
            router.push({ name: App_Route_Names.HOME });

        } catch (err) {
            showError(err.message);
            error.value = err.message;
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



.btn-outline-main {
    border: 2px solid rgb(74, 176, 224);
    color: rgb(74, 176, 224);
}

.btn-outline-main:hover {
    background-color: rgb(74, 176, 224);
    color: #fff;
}
</style>
