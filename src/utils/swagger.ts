import swaggerUi from 'swagger-ui-express';
import swaggerDocument from '../../docs/swagger.json';

export function setupSwagger(app: any) {
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
} 