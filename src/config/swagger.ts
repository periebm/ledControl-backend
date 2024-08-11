const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Garden Backend',
    description: 'API Garden Backend',
  },
  host: 'localhost:3002',
  securityDefinitions: {
    bearerAuth: {
      type: 'oauth2',
      bearerFormat: 'JWT',
      in: 'header',
      name: 'Authorization',
      description: 'Provide a JWT bearer token',
      value: 'Bearer XXXXXXXXXXXXXXXXXX',
      scopes: {
        all: 'All requests',
      },
    },
  },
};

const outputFile = './swagger-output.json';
const routes = ['src/config/routes.ts'];


swaggerAutogen(outputFile, routes, doc);