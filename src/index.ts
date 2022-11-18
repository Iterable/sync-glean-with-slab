import { CREATE_DATASOURCE, SYNC_USERS, SYNC_POSTS, GET_DOCS_COUNT } from './constants.js';
import { createDataSource, DataSource } from './datasource.js';
import { ingestSlabUsers } from './syncUsers.js';
import { ingestSlabPosts } from './syncPosts.js';
import { getDocumentCount } from './glean/index.js';

const main = async () => {
  console.info('Started');

  const batchUploadId = Date.now().toString();

  if (CREATE_DATASOURCE) {
    await createDataSource();
  }
  if (SYNC_USERS) {
    await ingestSlabUsers(batchUploadId);
  }
  if (SYNC_POSTS) {
    await ingestSlabPosts(batchUploadId);
  }

  let count = 0;
  if (GET_DOCS_COUNT) {
    count = await getDocumentCount(DataSource.name);
  }

  console.info('Finished', count);
};

await main();
