import { Client, Account } from 'appwrite';

const client = new Client();

client
  .setEndpoint('http://10.0.0.198/v1') // 👈 This is your local IP + /v1
  .setProject('67e57019002c630c8238');      // 👈 Replace with your actual project ID

const account = new Account(client);

export { client, account };
