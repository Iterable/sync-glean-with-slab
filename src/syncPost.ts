import { addDocument } from "./glean/index.js";
import { getPost } from "./slab/index.js";
import { DataSource } from "./datasource.js";
import { mapPostToGlean } from './syncPosts.js';

const fetchPost = async () => {
  try {
    console.info('Fetching one post from Slab');
    const response = await getPost('7hfj9e3e');
    // console.info("Found post", response);
    return response;
  } catch (error: any) {
    console.error('Unable to fetch posts from Slab');
    console.trace(error);
    return;
  }
}

export const ingestSlabPosts = async (uploadId: string) => {
  const posts = await fetchPost();

  if (!posts) {
    return;
  }

  await addDocument(mapPostToGlean(posts), DataSource.name);

  console.info('Finished single post sync');
}
