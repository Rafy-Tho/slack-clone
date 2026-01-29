import { Inngest } from 'inngest';
import connectDB from './database.js';
import User from '../models/User.js';

// Create a client to send and receive events
export const inngest = new Inngest({ id: 'slack-clone' });

const synUser = inngest.createFunction(
  { id: 'sync-user' },
  { event: 'clerk/user.created' },
  async ({ event }) => {
    await connectDB();

    const { id, email_address, username, first_name, last_name, image_url } =
      event.data;
    const user = await User.create({
      name: `${first_name} ${last_name}`,
      email: email_address[0]?.email_address,
      image: image_url,
      clerkId: id,
    });
  },
);
const deleteUser = inngest.createFunction(
  { id: 'delete-user' },
  { event: 'clerk/user.deleted' },
  async ({ event }) => {
    await connectDB();
    const { id } = event.data;
    await User.findOneAndDelete({ clerkId: id });
  },
);
// Create an empty array where we'll export future Inngest functions
export const functions = [synUser, deleteUser];
