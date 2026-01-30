import { Inngest } from 'inngest';
import connectDB from './database.js';
import User from '../models/User.js';
import { deleteStreamUser, upsertUser } from './stream.js';

// Create a client to send and receive events
export const inngest = new Inngest({ id: 'slack-clone' });

const synUser = inngest.createFunction(
  { id: 'sync-user' },
  { event: 'clerk/user.created' },
  async ({ event }) => {
    await connectDB();

    const { id, email_addresses, username, first_name, last_name, image_url } =
      event.data;
    const user = await User.create({
      name: `${first_name} ${last_name}`,
      email: email_addresses[0]?.email_address,
      image: image_url,
      clerkId: id,
    });
    await upsertUser({
      id: user.clerkId.toString(),
      name: user.name,
      image: user.image,
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
    await deleteStreamUser(id.toString());
  },
);
// Create an empty array where we'll export future Inngest functions
export const functions = [synUser, deleteUser];
