import '../instrument.js';
import express from 'express';
import cors from 'cors';
import connectDB from './config/database.js';
import { clerkMiddleware } from '@clerk/express';
import * as Sentry from '@sentry/node';
import { ENV } from './config/env.js';
import { serve } from 'inngest/express';
import { inngest, functions } from './config/inngest.js';
import chatRoutes from './routes/chatRoute.js';
// configuration
const PORT = ENV.PORT;
const app = express();
app.use(clerkMiddleware());
app.use(express.json());
app.use(cors({ origin: ENV.CLIENT_URL, credentials: true }));

app.get('/debug-sentry', (req, res) => {
  throw new Error('My first Sentry error!');
});
// routes
// Set up the "/api/inngest" (recommended) routes with the serve handler
app.use('/api/inngest', serve({ client: inngest, functions }));
app.use('/api/chat', chatRoutes);
app.get('/', (req, res) => {
  res.send('Hello World!');
});

Sentry.setupExpressErrorHandler(app);
// server
const server = async () => {
  try {
    await connectDB();
    if (ENV.NODE_ENV === 'development')
      app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
      });
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
server();

export default app;
