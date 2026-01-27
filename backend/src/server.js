import express from 'express';
import cors from 'cors';
import connectDB from './config/database.js';
import { ENV } from './config/env.js';
// configuration
const PORT = ENV.PORT;
const app = express();
app.use(express.json());
app.use(cors());
// routes

// server
const server = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

server();
