import { ensureDataSource, DataSource as IDataSource, DocumentType, setBetaUsers } from './glean/index.js';

import { BETA_USERS, IS_TEST } from './constants.js';

export const DataSource: IDataSource = {
  name: `slab${IS_TEST ? 'test' : ''}`,
  displayName: `Slab${IS_TEST ? ' (Test)' : ''}`,
  datasourceCategory: DocumentType.KNOWLEDGE_HUB,
  isUserReferencedByEmail: false,
  urlRegex: '^https://iterable.slab.*',
  isTestDatasource: IS_TEST,
};

export const createDataSource = async () => {
  try {
    console.info(`Ensuring Glean datasource ${DataSource.name} exists`);
    await ensureDataSource(DataSource);
    if (IS_TEST) {
      console.info('Adding beta users to Glean data source');
      await setBetaUsers(DataSource.name, BETA_USERS);
    }
  } catch (error: any) {
    console.error('There was a problem syncing the test datasource');
    console.trace(error?.response?.body);
  }
};
