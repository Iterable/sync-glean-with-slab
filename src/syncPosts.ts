import { getUnixTime, parseISO } from 'date-fns';
import {
  forceProcessing,
  syncDocuments,
  Document,
  DocumentPermissions,
  PAGE,
} from './glean/index.js';
import { getPostIds, getPosts, LinkAccess, Post, PostContent } from './slab/index.js';
import { DataSource, PostType } from './datasource.js';
import { BATCH_SIZE, SLAB_WORKSPACE } from './constants.js';

const chunk = <T>(arr: T[], size = BATCH_SIZE) =>
  Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
    arr.slice(i * size, i * size + size),
  );

const convertToEpoch = (value: string): number => getUnixTime(parseISO(value));

const getPostStatus = (post: Post): string => {
  if (!post.publishedAt) {
    return 'draft';
  }

  if (post.archivedAt) {
    return 'archived';
  }

  return '';
};

const getDocumentPermissions = (post: Post): DocumentPermissions => {
  // Only allow owners to see a post if it is not published or it's marked as hidden
  if (!post.publishedAt || post.linkAccess === LinkAccess.disabled) {
    return {
      allowedUsers: [
        {
          datasourceUserId: post.owner.id,
        },
      ],
    };
  }

  // Expose to all users if marked as public
  if (post.linkAccess === LinkAccess.public) {
    return {
      allowAnonymousAccess: true,
    };
  }

  // Otherwise, allow all Slab users
  return {
    allowAllDatasourceUsersAccess: true,
  };
};

const getContentBody = (content: string): string => {
  try {
    const parsedContent: PostContent | PostContent[] = JSON.parse(content);

    if (!parsedContent) {
      console.warn('No content found for post');
      return '';
    }

    if (Array.isArray(parsedContent)) {
      return parsedContent.map((p) => p.insert).join('');
    }

    return parsedContent.insert || '';
  } catch {
    console.error('Could not parse that body');
  }

  return '';
};

export const mapPostToGlean = (post: Post): Document => ({
  id: post.id,
  title: post.title,
  objectType: PostType.name,
  body: {
    mimeType: 'text/plain',
    textContent: getContentBody(post.content),
  },
  owner: {
    datasourceUserId: post.owner.id,
  },
  permissions: getDocumentPermissions(post),
  createdAt: post.publishedAt ? convertToEpoch(post.publishedAt) : undefined,
  updatedAt: post.updatedAt ? convertToEpoch(post.updatedAt) : undefined,
  viewURL: `https://${SLAB_WORKSPACE}.slab.com/posts/${post.id}`,
  status: getPostStatus(post),
});

const filterUnpublished = (post: Post): boolean =>
  Boolean(post.publishedAt) && getContentBody(post.content).length > 0;

const fetchPostIds = async () => {
  try {
    console.info('Fetching all post IDs from Slab');
    return await getPostIds();
  } catch (error: any) {
    console.error('Unable to fetch post IDs from Slab');
    console.trace(error?.response?.error);
  }
};

const fetchPosts = async (ids: string[]) => {
  try {
    console.info('Fetching some posts from Slab');
    return await getPosts(ids);
  } catch (error: any) {
    console.error('Unable to fetch posts from Slab');
    console.trace(error?.response?.error);
  }
};

const processBatch = async (uploadId: string,  ids: string[], page?: number)=> {
  const posts = await fetchPosts(ids);

  if (!posts) {
    return;
  }

  return syncDocuments(posts.filter(filterUnpublished).map(mapPostToGlean), DataSource.name, uploadId, page);
}

export const ingestSlabPosts = async (uploadId: string) => {
  const postIds = await fetchPostIds();

  if (!postIds) {
    return;
  }

  const batches = chunk(postIds);
  const total = batches.length;

  // Ensure the first batch is submitted before sending the rest en masse
  const [first, ...rest] = batches;
  console.info(`Syncing Slab posts batch 1 of ${total} to Glean (FIRST)`);
  let promise = processBatch(uploadId, first, PAGE.first);

  rest.forEach((docs, index) => {
    const oneIndex = index + 2;
    const last = oneIndex === total;

    promise = promise.then(() => {
      console.info(`Syncing Slab posts batch ${oneIndex} of ${total} to Glean`);
      return processBatch(uploadId, docs, last ? PAGE.last : undefined)
    });
  });

  await promise;

  try {
    await forceProcessing(DataSource.name);
  } catch (error: any) {
    console.warn(error?.response?.body ?? 'Failed to force indexing');
  }
  console.info('Finishes posts sync');
};
