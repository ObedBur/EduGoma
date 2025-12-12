import { defineConfig } from 'vite';
import { VitePluginNode } from 'vite-plugin-node';

export default defineConfig({
  // Le serveur de développement qui fera tourner l'API
  server: {
    port: 3000,
  },
  
  // Configuration des plugins Vite
  plugins: [
    // VitePluginNode est crucial pour faire fonctionner NestJS avec Vite
    ...VitePluginNode({
      // L'adaptateur NestJS est utilisé ici
      adapter: 'nest',
      // Le point d'entrée de votre application NestJS
      appPath: './src/main.ts',
      // Nom de l'exportation dans main.ts
      exportName: 'viteNodeApp',
      // Utilisation de SWC pour une compilation rapide
      tsCompiler: 'swc',
      swcOptions: {},
    }),
  ],
  
  // Dépendances à exclure de l'optimisation des modules par Vite
  optimizeDeps: {
    exclude: [
      '@nestjs/microservices',
      '@nestjs/websockets',
      'cache-manager',
      'class-transformer',
      'class-validator',
      // 'fastify-swagger' n'est pas nécessaire si on utilise Express
    ],
  },
});