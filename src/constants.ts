import dotenv from 'dotenv-safe';

dotenv.config();

const getEnvBoolean = (key: string): boolean => {
  const raw = process.env[key];

  return (raw === 'true');
}

const getEnvNumber = (key: string, fallback = 20): number => {
  const raw = process.env[key];
  if (!raw) {
    return fallback;
  }

  const parsed = Number.parseInt(raw, 10);

  return (Number.isNaN(parsed)) ? fallback : parsed;
}

export const SLAB_WORKSPACE = process.env.SLAB_WORKSPACE!;
export const SLAB_TOKEN = process.env.SLAB_TOKEN!;

export const GLEAN_WORKSPACE = process.env.GLEAN_WORKSPACE!;
export const GLEAN_TOKEN = process.env.GLEAN_TOKEN!;

export const CREATE_DATASOURCE = getEnvBoolean('CREATE_DATASOURCE');
export const SYNC_USERS = getEnvBoolean('SYNC_USERS');
export const SYNC_POSTS = getEnvBoolean('SYNC_POSTS');
export const GET_DOCS_COUNT = getEnvBoolean('GET_DOCS_COUNT');

export const IS_TEST = getEnvBoolean('IS_TEST');
export const BETA_USERS = process.env.BETA_USERS!.split(',');

export const FORCE_REUPLOAD = getEnvBoolean('FORCE_REUPLOAD');
export const BATCH_SIZE = getEnvNumber('BATCH_SIZE', 100);
