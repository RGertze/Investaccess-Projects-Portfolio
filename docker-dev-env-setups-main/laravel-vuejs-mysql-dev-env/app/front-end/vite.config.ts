import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default ({mode}) => {
    return defineConfig({
        server: {
            port: 3000,
        },
        build: {
            outDir: '../back-end/public/app',
        },
        base: mode === 'production' ? '/app/' : '/',
        plugins: [vue()],
    });
}
