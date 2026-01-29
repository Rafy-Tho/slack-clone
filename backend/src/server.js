import express from 'express';
import cors from 'cors';
import connectDB from './config/database.js';
import { clerkMiddleware } from '@clerk/express';
import { ENV } from './config/env.js';
import { serve } from 'inngest/express';
import { inngest, functions } from './config/inngest.js';
// configuration
const PORT = ENV.PORT;
const app = express();
app.use(clerkMiddleware);
app.use(express.json());
app.use(cors());
// routes
// Set up the "/api/inngest" (recommended) routes with the serve handler
app.use('/api/inngest', serve({ client: inngest, functions }));

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
