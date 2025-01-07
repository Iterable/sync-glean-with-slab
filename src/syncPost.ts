import { addDocument } from "./glean/index.js";
import { getPost } from "./slab/index.js";
import { DataSource } from "./datasource.js";
import { mapPostToGlean } from './syncPosts.js';

const fetchPost = async (postId: string) => {
  try {
    console.info('Fetching one post from Slab');
    const response = await getPost(postId);
    return response;
  } catch (error: any) {
    console.error('Unable to fetch posts from Slab');
    console.trace(error);
  }
};

export const ingestSlabPosts = async (postId: string) => {
  const post = await fetchPost(postId);

  if (!post) {
    return;
  }

  await addDocument(mapPostToGlean(post), DataSource.name);

  console.info('Finished single post sync');
};
