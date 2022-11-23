import { CREATE_DATASOURCE, SYNC_USERS, SYNC_POSTS, GET_DOCS_COUNT, IS_TEST } from './constants.js';
import { createDataSource, DataSource } from './datasource.js';
import { ingestSlabUsers } from './syncUsers.js';
import { ingestSlabPosts } from './syncPosts.js';
import { getDocumentCount } from './glean/index.js';

const main = async () => {
  console.info('Started');

  if (CREATE_DATASOURCE) {
    await createDataSource();
  }
  if (SYNC_USERS) {
    await ingestSlabUsers(Date.now().toString());
  }
  if (SYNC_POSTS) {
    await ingestSlabPosts(Date.now().toString());
  }

  let count = 0;
  if (GET_DOCS_COUNT) {
    count = await getDocumentCount(DataSource.name);
  }

  console.info('Finished', count);
};

await main();
