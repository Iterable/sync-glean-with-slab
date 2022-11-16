import { post } from './api.js';

export interface User {
  email: string,
  userId: string,
  name: string,
  isActive: boolean
}

export const addUser = async (user: User, datasource?: string) => post('indexuser', { user, datasource });

export const addUserTo = (datasource: string) => async (user: User) => addUser(user, datasource);

export const syncUsers = async (users: User[], datasource: string, uploadId: string) => post('bulkindexusers', {
  uploadId,
  users, 
  datasource,
  isFirstPage: true,
  isLastPage: true,
});
