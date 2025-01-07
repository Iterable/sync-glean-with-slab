import { gql } from 'graphql-request';

import { slabApi } from './api.js';

export interface User {
  deactivatedAt?: string;
  email: string;
  id: string;
  name: string;
}

interface UsersResponse {
  organization: {
    users: User[];
  };
}

const usersQuery = gql`
  {
    organization {
      users(includeDeactivated: true) {
        id
        name
        email
        deactivatedAt
      }
    }
  }
`;

export const getUsers = async () => {
  const results = await slabApi.request<UsersResponse>(usersQuery);

  return results.organization.users;
};
