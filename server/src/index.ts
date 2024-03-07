import 'dotenv/config'
import express, { Application } from 'express';
import boardRoutes from './routes/boardRoutes';
import { errorHandler } from './middlewares/errorHandler';
import helmet from 'helmet';
import cors from 'cors'
import morgan from 'morgan'
import path from 'path';



const app: Application = express();
const port = process.env.PORT || 3001;
 
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN })); // Configure your CORS policy
app.use(express.json());
app.use('/api/boards', boardRoutes); // Mount board routes
app.use(errorHandler)


if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}


if (process.env.NODE_ENV === 'production') {
app.use(morgan('combined'));
  app.use((req, res, next) => {
    if (req.header('x-forwarded-proto') !== 'https') {
      res.redirect(`https://${req.header('host')}${req.url}`);
    } else {
      next();
    }
  });
}

app.listen(port, () => { 
    console.log(`[server]: Server is running at ${port}`);
});

export default app;
