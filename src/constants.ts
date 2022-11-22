import dotenv from 'dotenv-safe';

dotenv.config();

export const SLAB_TOKEN = process.env.SLAB_TOKEN!;
export const GLEAN_TOKEN = process.env.GLEAN_TOKEN!;
export const BETA_USERS = process.env.BETA_USERS!.split(',');

// TODO: Convert to envvars
export const CREATE_DATASOURCE = false;
export const SYNC_USERS = false;
export const SYNC_POSTS = true;
export const GET_DOCS_COUNT = false;
export const IS_TEST = true;
export const FORCE_REUPLOAD = true;
