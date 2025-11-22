<template>
    <div class="login">
        <h2>Login</h2>
        <input v-model="email" placeholder="Email" />
        <input v-model="password" type="password" placeholder="Password" />
        <button @click="login">Ingresar</button>
    </div>
</template>

<script>
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

export default {
    setup() {
        const router = useRouter();
        const email = ref('');
        const password = ref('');

        const login = async () => {
            try {
                const res = await axios.post('http://localhost:5000/api/auth/login', {
                    email: email.value,
                    password: password.value
                });

                console.log(res.data);
                localStorage.setItem('token', res.data.token);
                router.push('/home');
            } catch (err) {
                alert('Login fallido');
            }
        };


        return { email, password, login };
    }
};
</script>
