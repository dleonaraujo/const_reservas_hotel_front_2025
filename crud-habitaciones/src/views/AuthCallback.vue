<template>
    <div class="callback-container">
        <div class="loading">
            <div class="spinner"></div>
            <p v-if="!error">Completando autenticación...</p>
            <p v-else class="error-text">{{ error }}</p>
        </div>
    </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

export default {
    setup() {
        const router = useRouter();
        const error = ref('');

        onMounted(() => {
            const urlParams = new URLSearchParams(window.location.search);
            const token = urlParams.get('token');
            const userParam = urlParams.get('user');
            const errorParam = urlParams.get('error');
            
            if (errorParam) {
                console.error('Error en autenticación:', errorParam);
                error.value = 'Error al autenticar con Google';
                setTimeout(() => {
                    router.push('/?error=auth_failed');
                }, 2000);
                return;
            }
            
            if (token) {
                console.log('Token recibido:', token);
                localStorage.setItem('token', token);
                
                if (userParam) {
                    try {
                        const user = JSON.parse(userParam);
                        localStorage.setItem('user', JSON.stringify(user));
                        console.log('Usuario guardado:', user);
                    } catch (e) {
                        console.error('Error parseando usuario:', e);
                    }
                }
                
                // Redirigir al home
                setTimeout(() => {
                    router.push('/home');
                }, 500);
            } else {
                error.value = 'No se recibió token de autenticación';
                setTimeout(() => {
                    router.push('/');
                }, 2000);
            }
        });

        return { error };
    }
};
</script>

<style scoped>
.callback-container {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.loading {
    text-align: center;
    color: white;
}

.spinner {
    width: 50px;
    height: 50px;
    margin: 0 auto 20px;
    border: 4px solid rgba(255, 255, 255, 0.3);
    border-top: 4px solid white;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

.loading p {
    font-size: 16px;
    font-weight: 500;
    margin: 0;
}

.error-text {
    color: #ffcccc;
}
</style>