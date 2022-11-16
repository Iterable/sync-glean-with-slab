import dotenv from 'dotenv-safe';

dotenv.config();



export const SLAB_TOKEN = process.env.SLAB_TOKEN!;
export const GLEAN_TOKEN = process.env.GLEAN_TOKEN!;
export const BETA_USERS = process.env.BETA_USERS!.split(',');
