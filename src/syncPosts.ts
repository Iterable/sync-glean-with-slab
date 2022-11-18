import { getUnixTime, parseISO } from 'date-fns';
import { forceProcessing, syncDocuments, Document, DocumentPermissions, PAGE } from "./glean/index.js";
import { getPosts, LinkAccess, Post, PostContent } from "./slab/index.js";
import { DataSource } from "./datasource.js";

const chunk = <T>(arr: T[], size = 100) =>
  Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
    arr.slice(i * size, i * size + size)
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
}

const getDocumentPerommsions = (post: Post): DocumentPermissions => {
  // Only allow owners to see a post if it is not published or it's marked as hidden
  if (!post.publishedAt || post.linkAccess == LinkAccess.disabled) {
    return {
      allowedUsers: [{
        datasourceUserId: post.owner.id,
      }]
    }
  }

  // Expose to all users if marked as public
  if (post.linkAccess == LinkAccess.public) {
    return {
      allowAnonymousAccess: true,
    }
  }

  // Otherwise, allow all Slab users
  return {
    allowAllDatasourceUsersAccess: true,
  };
}

const getContentBody = (content: PostContent | PostContent[]): string => {
  if (!content) {
    return "";
  }

  if (Array.isArray(content)) {
    return content.map(p => p.insert).join("");
  }

  return content.insert || "";
}

const mapPostToGlean = (post: Post): Document => ({
  id: post.id,
  title: post.title,
  body: {
    mimeType: "text/plain",
    textContent: getContentBody(post.content),
  },
  owner: {
    datasourceUserId: post.owner.id,
  },
  permissions: getDocumentPerommsions(post),
  createdAt: post.publishedAt ? convertToEpoch(post.publishedAt) : undefined,
  updatedAt: post.updatedAt ? convertToEpoch(post.updatedAt) : undefined,
  viewURL: `https://iterable.slab.com/posts/${post.id}`,
  status: getPostStatus(post),
});

const filterUnpublished = (post: Post): boolean => Boolean(post.publishedAt) && getContentBody(post.content).length > 0;

const fetchPosts = async () => {
  try {
    console.info('Fetching all posts from Slab');
    return getPosts();
  } catch (error) {
    console.error('Unable to fetch posts from Slab');
    console.trace(error);
    return;
  }
}

export const ingestSlabPosts = async (uploadId: string) => {
  const posts = await fetchPosts();

  if (!posts) {
    return;
  }

  const batches = chunk(posts.filter(filterUnpublished));
  const last = batches.length - 1;
  await Promise.all(batches.map(async (docs, index) => {
    const currentPage = (index === 0) ? PAGE.first : (index == last) ? PAGE.last : undefined;
    console.info(`Syncing Slab posts batch ${index + 1} of ${last + 1} to Glean (${currentPage})`);
    return Promise.resolve();
    return syncDocuments(docs.map(mapPostToGlean), DataSource.name, uploadId, currentPage);
  }));

  try {
    await forceProcessing(DataSource.name);
  } catch (error: any) {
    console.warn(error?.response?.body ?? 'Failed to force indexing');
  }
  console.info('Finishes posts sync');
}
