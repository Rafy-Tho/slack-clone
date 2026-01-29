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

    const { id, email_addresses, username, first_name, last_name, image_url } =
      event.data;
    const user = await User.create({
      name: `${first_name} ${last_name}`,
      email: email_addresses[0]?.email_address,
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
[
  {
    id: '01KG5Z87V49Y5G7ME0PDRM6VMY',
    name: 'clerk/user.created',
    data: {
      backup_code_enabled: false,
      banned: false,
      bypass_client_trust: false,
      create_organization_enabled: true,
      created_at: 1769727073815,
      delete_self_enabled: true,
      email_addresses: [
        {
          created_at: 1769727057124,
          email_address: 'kmak6983@gmail.com',
          id: 'idn_38x2mBaYjIocL44wtCRKEYOBPgN',
          linked_to: [
            {
              id: 'idn_38x2mDypEdggOhLF2WP1mFsPu3q',
              type: 'oauth_google',
            },
          ],
          matches_sso_connection: false,
          object: 'email_address',
          reserved: false,
          updated_at: 1769727073825,
          verification: {
            attempts: null,
            expire_at: null,
            object: 'verification_from_oauth',
            status: 'verified',
            strategy: 'from_oauth_google',
          },
        },
      ],
      enterprise_accounts: [],
      external_accounts: [
        {
          approved_scopes:
            'email https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile openid profile',
          avatar_url:
            'https://lh3.googleusercontent.com/a/ACg8ocJM3G90JENJF5PgX6isu_p_-FrdH1ISD5zW0VLdT44j9Lw8Q5wE=s1000-c',
          created_at: 1769727057112,
          email_address: 'kmak6983@gmail.com',
          external_account_id: 'eac_38x2mE4Kq0d8XiUP6v46I97edwX',
          family_name: 'Tho',
          first_name: 'RARA',
          given_name: 'RARA',
          google_id: '100226004764555254472',
          id: 'idn_38x2mDypEdggOhLF2WP1mFsPu3q',
          identification_id: 'idn_38x2mDypEdggOhLF2WP1mFsPu3q',
          image_url:
            'https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS9BQ2c4b2NKTTNHOTBKRU5KRjVQZ1g2aXN1X3BfLUZyZEgxSVNENXpXMFZMZFQ0NGo5THc4UTV3RT1zMTAwMC1jIiwicyI6Im52OFJsLzg4Z1Z6WUVzdTRPOW5OTTc1TGUrMmtRekZscG9iMlM3WHJXMFkifQ',
          label: null,
          last_name: 'Tho',
          object: 'google_account',
          picture:
            'https://lh3.googleusercontent.com/a/ACg8ocJM3G90JENJF5PgX6isu_p_-FrdH1ISD5zW0VLdT44j9Lw8Q5wE=s1000-c',
          provider: 'oauth_google',
          provider_user_id: '100226004764555254472',
          public_metadata: {},
          updated_at: 1769727057112,
          username: null,
          verification: {
            attempts: null,
            expire_at: 1769727603835,
            object: 'verification_oauth',
            status: 'verified',
            strategy: 'oauth_google',
          },
        },
      ],
      external_id: null,
      first_name: 'RARA',
      has_image: true,
      id: 'user_38x2o8RlnkJFhJXZzxKJieVQkAo',
      image_url:
        'https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvb2F1dGhfZ29vZ2xlL2ltZ18zOHgyb0Y4eER6ZjJWeXBiYVNZNlRoM3lRQkEifQ',
      last_active_at: 1769727073813,
      last_name: 'Tho',
      last_sign_in_at: null,
      legal_accepted_at: null,
      locale: null,
      locked: false,
      lockout_expires_in_seconds: null,
      mfa_disabled_at: null,
      mfa_enabled_at: null,
      object: 'user',
      passkeys: [],
      password_enabled: false,
      password_last_updated_at: null,
      phone_numbers: [],
      primary_email_address_id: 'idn_38x2mBaYjIocL44wtCRKEYOBPgN',
      primary_phone_number_id: null,
      primary_web3_wallet_id: null,
      private_metadata: {},
      profile_image_url:
        'https://images.clerk.dev/oauth_google/img_38x2oF8xDzf2VypbaSY6Th3yQBA',
      public_metadata: {},
      requires_password_reset: false,
      saml_accounts: [],
      totp_enabled: false,
      two_factor_enabled: false,
      unsafe_metadata: {},
      updated_at: 1769727073841,
      username: null,
      verification_attempts_remaining: 100,
      web3_wallets: [],
    },
    ts: 1769727074148,
  },
];
