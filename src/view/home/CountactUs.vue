<template>
    <div class="container my-5">
        <div class="row justify-content-center">
            <div class="col-lg-8">
                <div class="card shadow-sm rounded">
                    <div class="card-header bg-primary text-white">
                        <h4 class="mb-0">📬 Contact Us</h4>
                    </div>
                    <div class="card-body">
                        <form @submit.prevent="submitForm">
                            <!-- Name -->
                            <div class="mb-3">
                                <label for="name" class="form-label">Full Name</label>
                                <input type="text" v-model="form.name" class="form-control" id="name"
                                    placeholder="Your Name" required>
                            </div>

                            <!-- Email -->
                            <div class="mb-3">
                                <label for="email" class="form-label">Email address</label>
                                <input type="email" v-model="form.email" class="form-control" id="email"
                                    placeholder="you@example.com" required>
                            </div>

                            <!-- Subject -->
                            <div class="mb-3">
                                <label for="subject" class="form-label">Subject</label>
                                <input type="text" v-model="form.subject" class="form-control" id="subject"
                                    placeholder="Subject" required>
                            </div>

                            <!-- Message -->
                            <div class="mb-3">
                                <label for="message" class="form-label">Message</label>
                                <textarea v-model="form.message" class="form-control" id="message" rows="5"
                                    placeholder="Your message..." required></textarea>
                            </div>

                            <!-- Submit Button -->
                            <div class="d-grid">
                                <button type="submit" class="btn btn-primary btn-lg">Send Message</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { reactive } from 'vue'

    const form = reactive({
        name: '',
        email: '',
        subject: '',
        message: ''
    })

    const submitForm = () => {
        // هنا تحط الكود لإرسال البيانات مثلا API أو Firebase
        alert(`Thank you, ${form.name}! Your message has been sent.`)
        form.name = ''
        form.email = ''
        form.subject = ''
        form.message = ''
    }
</script>

<style scoped>
.card-header {
    border-bottom: none;
}

textarea {
    resize: none;
}
</style>
