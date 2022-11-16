import { post } from './api.js';

export const setBetaUsers = async (datasource: string, emails: string[]) =>
  post('betausers', {
    datasource,
    emails,
  });
