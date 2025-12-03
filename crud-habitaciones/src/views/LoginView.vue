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
                        :disabled="loading"
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
                        :disabled="loading"
                    />
                </div>
                
                <button type="submit" class="login-button" :disabled="loading">
                    {{ loading ? 'Ingresando...' : 'Ingresar' }}
                </button>
            </form>

            <div class="divider">
                <span>o</span>
            </div>

            <button @click="loginWithGoogle" class="google-button" :disabled="loading">
                <svg class="google-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Iniciar sesión con Google
            </button>

            <div v-if="error" class="error-message">
                {{ error }}
            </div>
            
            <div class="login-footer">
                <a href="#">¿Olvidaste tu contraseña?</a>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter, useRoute } from 'vue-router';

export default {
    setup() {
        const router = useRouter();
        const route = useRoute();
        const email = ref('');
        const password = ref('');
        const loading = ref(false);
        const error = ref('');

        const login = async () => {
            loading.value = true;
            error.value = '';
            
            try {
                const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, {
                    email: email.value,
                    password: password.value
                });

                console.log('Login exitoso:', res.data);
                localStorage.setItem('token', res.data.token);
                
                if (res.data.user) {
                    localStorage.setItem('user', JSON.stringify(res.data.user));
                }
                
                router.push('/home');
            } catch (err) {
                console.error('Error en login:', err);
                error.value = err.response?.data?.msg || 'Login fallido. Verifica tus credenciales.';
            } finally {
                loading.value = false;
            }
        };

        const loginWithGoogle = () => {
            loading.value = true;
            const apiUrl = import.meta.env.VITE_API_URL;
            window.location.href = `${apiUrl}/auth/login/google`;
        };

        // Mostrar error si viene de un callback fallido
        onMounted(() => {
            if (route.query.error) {
                error.value = 'Error al autenticar con Google. Intenta de nuevo.';
            }
        });

        return { 
            email, 
            password, 
            loading, 
            error,
            login, 
            loginWithGoogle 
        };
    }
};
</script>

<style scoped>
/* ... mismo CSS que antes ... */
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

.input-group input:disabled {
    background: #f5f5f5;
    cursor: not-allowed;
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

.login-button:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(102, 126, 234, 0.4);
}

.login-button:active:not(:disabled) {
    transform: translateY(0);
}

.login-button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.divider {
    display: flex;
    align-items: center;
    margin: 25px 0;
    color: #999;
    font-size: 14px;
}

.divider::before,
.divider::after {
    content: '';
    flex: 1;
    height: 1px;
    background: #e0e0e0;
}

.divider span {
    padding: 0 15px;
}

.google-button {
    width: 100%;
    padding: 14px;
    background: white;
    color: #444;
    border: 2px solid #e0e0e0;
    border-radius: 10px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
}

.google-button:hover:not(:disabled) {
    border-color: #4285F4;
    box-shadow: 0 4px 12px rgba(66, 133, 244, 0.2);
    transform: translateY(-2px);
}

.google-button:active:not(:disabled) {
    transform: translateY(0);
}

.google-button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.google-icon {
    width: 20px;
    height: 20px;
}

.error-message {
    margin-top: 15px;
    padding: 12px;
    background: #fee;
    border: 1px solid #fcc;
    border-radius: 8px;
    color: #c33;
    font-size: 14px;
    text-align: center;
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