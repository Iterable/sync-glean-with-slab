import { createDataSource, DataSource } from "./datasource.js";
import { ingestSlabUsers } from "./syncUsers.js";
import { ingestSlabPosts } from "./syncPosts.js";
import { getDocumentCount, forceProcessing } from "./glean/index.js";

console.info("Started");

const batchUploadId = Date.now().toString();

// await createDataSource();
// await ingestSlabUsers(batchUploadId);
await ingestSlabPosts(batchUploadId);
const count = await getDocumentCount(DataSource.name);

console.info("Finished", count);
