// src/swagger/swagger.ts
import { config } from 'dotenv';
config();

// eslint‑disable‑next‑line @typescript-eslint/no-var-requires
const swaggerAutogen = require('swagger-autogen')({openapi:'3.0.0'});

const doc = {
  info: {
    title: 'Library API',
    description: 'CRUD + Booking + Auth (OTP) for library management',
  },
  host: process.env.HOST || `localhost:${process.env.PORT || 5000}`,
  schemes: ['http', 'https'],
  basePath: '/api',
  securityDefinitions: {
    bearerAuth: {
      type: "apiKey",
      in: "header",
      name: "Authorization",
      description: "Enter your bearer token in the format **Bearer &lt;token>**",
    },
  },
  definitions: {
    RegisterDto: {
      email: 'user@example.com',
      password: 'strongPassword',
      firstName: 'John',
      lastName: 'Doe',
    },
    LoginDto: {
      email: 'user@example.com',
      password: 'strongPassword',
    },
    CreateBookDto: {
      name: 'Clean Code',
      author: 'Robert C. Martin',
      publisher: 'Prentice Hall',
      publicationYear: '2008',
      subject: 'Software Engineering',
    },
    CreateBookingDto: {
      bookId: 1,
      endDate: '2025-06-01T00:00:00.000Z',
      price: 5.0,
    },
    EmailDto: { email: 'user@example.com' },
    ResetPasswordDto: {
      email: 'user@example.com',
      code: '123456',
      newPassword: 'newStrongPassword',
    },
  },
};

const outputFile = './src/swagger/docs/swagger-output.json';
const endpointsFiles = [
  './src/routes/index.routes.ts'
];

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  console.log('Swagger JSON at', outputFile);
});
