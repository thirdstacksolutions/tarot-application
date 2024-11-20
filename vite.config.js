import { defineConfig } from 'vite';

export default defineConfig({
    test: {
        include: ['server/tests/**/*.test.js'],
        globals: true
    }
});
