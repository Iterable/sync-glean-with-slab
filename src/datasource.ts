import { ensureDataSource, DataSource as IDataSource, DocumentType, setBetaUsers } from './glean/index.js';

import { BETA_USERS } from './constants.js';

export const DataSource: IDataSource = {
  name: 'slabtest',
  displayName: 'Slab (Test)',
  datasourceCategory: DocumentType.KNOWLEDGE_HUB,
  isUserReferencedByEmail: false,
  urlRegex: '^https://iterable.slab.*',
  isTestDatasource: true,
};

export const createDataSource = async () => {
  try {
    console.info(`Ensuring Glean datasource ${DataSource.name} exists`);
    await ensureDataSource(DataSource);
    console.info('Adding beta users to Glean data source');
    await setBetaUsers(DataSource.name, BETA_USERS);
  } catch (error: any) {
    console.error('There was a problem syncing the test datasource');
    console.trace(error?.response?.body);
  }
};
