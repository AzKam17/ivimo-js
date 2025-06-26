import { Elysia } from 'elysia';

export const materialsRoutes = new Elysia({ name: 'materials' })
  // Add your routes here
  .get('/', () => 'Hello from materials module');
