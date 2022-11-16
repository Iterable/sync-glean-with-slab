import { createDataSource } from "./datasource.js";
import { ingestSlabUsers } from "./syncUsers.js";
import { ingestSlabPosts } from "./syncPosts.js";

console.info("Started");

const batchUploadId = Date.now().toString();

await createDataSource();
await ingestSlabUsers(batchUploadId);
await ingestSlabPosts(batchUploadId);

console.info("Finished");
