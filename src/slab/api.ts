import { GraphQLClient } from 'graphql-request';

import { SLAB_TOKEN } from '../constants.js';

const SLAB_URL = 'https://api.slab.com/v1/graphql';

export const slabApi = new GraphQLClient(SLAB_URL, {
  headers: {
    authorization: SLAB_TOKEN,
    contentType: 'application/json',
  },
});
