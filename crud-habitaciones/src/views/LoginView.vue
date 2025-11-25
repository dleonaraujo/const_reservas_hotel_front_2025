<template>
    <div class="login-container">
        <div class="login-card">
            <div class="login-header">
                <h2>Bienvenido</h2>
                <p>Ingresa a tu cuenta</p>
            </div>
            
            <form @submit.prevent="login" class="login-form">
                <div class="input-group">
                    <label for="email">Email</label>
                    <input 
                        id="email"
                        v-model="email" 
                        type="email"
                        placeholder="tu@email.com" 
                        required
                    />
                </div>
                
                <div class="input-group">
                    <label for="password">Contraseña</label>
                    <input 
                        id="password"
                        v-model="password" 
                        type="password" 
                        placeholder="••••••••" 
                        required
                    />
                </div>
                
                <button type="submit" class="login-button">
                    Ingresar
                </button>
            </form>
            
            <div class="login-footer">
                <a href="#">¿Olvidaste tu contraseña?</a>
            </div>
        </div>
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
                const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, {
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

<style scoped>
.login-container {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 20px;
}

.login-card {
    background: white;
    border-radius: 20px;
    padding: 40px;
    width: 100%;
    max-width: 420px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.login-header {
    text-align: center;
    margin-bottom: 35px;
}

.login-header h2 {
    font-size: 28px;
    font-weight: 700;
    color: #333;
    margin: 0 0 8px 0;
}

.login-header p {
    font-size: 15px;
    color: #666;
    margin: 0;
}

.login-form {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.input-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.input-group label {
    font-size: 14px;
    font-weight: 600;
    color: #333;
}

.input-group input {
    padding: 14px 16px;
    border: 2px solid #e0e0e0;
    border-radius: 10px;
    font-size: 15px;
    transition: all 0.3s ease;
    outline: none;
}

.input-group input:focus {
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.input-group input::placeholder {
    color: #aaa;
}

.login-button {
    margin-top: 10px;
    padding: 14px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    border-radius: 10px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
}

.login-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(102, 126, 234, 0.4);
}

.login-button:active {
    transform: translateY(0);
}

.login-footer {
    text-align: center;
    margin-top: 25px;
}

.login-footer a {
    color: #667eea;
    text-decoration: none;
    font-size: 14px;
    font-weight: 500;
    transition: color 0.3s ease;
}

.login-footer a:hover {
    color: #764ba2;
    text-decoration: underline;
}
</style>