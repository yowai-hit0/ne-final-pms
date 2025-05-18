import express,{ Request, Response }  from 'express';
import cors from 'cors';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import { PrismaClient } from '@prisma/client';
// import bodyParser from 'body-parser';
import router from './routes/index.routes';
import swaggerDocument from './swagger/docs/swagger-output.json';
import { config } from 'dotenv'; 
import cookieParser from 'cookie-parser';
import helmet from 'helmet'; 

const app = express();
config(); 

const prisma = new PrismaClient();


app.use(cors({
  origin: "*", 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
// Helmet middleware (security headers)
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", 'https:', "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "http://localhost:5600", "http://localhost:5173"],
      fontSrc: ["'self'", 'https:', 'data:'],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  },
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

app.use(express.json());
app.use(express.urlencoded())
app.use(cookieParser());
app.use(morgan('dev'));

app.use('/api', router);


app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

export default app;