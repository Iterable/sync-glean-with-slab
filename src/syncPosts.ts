import { getUnixTime, parseISO } from 'date-fns';
import { forceProcessing, addDocument, syncDocuments, Document, DocumentPermissions, PAGE } from "./glean/index.js";
import { getPost, getPosts, LinkAccess, Post, PostContent } from "./slab/index.js";
import { DataSource } from "./datasource.js";

const chunk = <T>(arr: T[], size = 50) =>
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

const getContentBody = (content: string): string => {
  try {
    const parsedContent: PostContent | PostContent[] = JSON.parse(content);
    
    if (!parsedContent) {
      console.warn("No content found for post");
      return "";
    }

    if (Array.isArray(parsedContent)) {
      const body = parsedContent.map(p => p.insert).join("");
      // console.info("Found content", body);
      return body;
    }
  
    return parsedContent.insert || "";
  } catch (e) {
    console.error("Could not parse that body");
  }

  return "";
}

export const mapPostToGlean = (post: Post): Document => ({
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
    const response = await getPosts();
    return response;
  } catch (error: any) {
    console.error('Unable to fetch posts from Slab');
    console.trace(error?.response?.error);
    return;
  }
}

export const ingestSlabPosts = async (uploadId: string) => {
  const posts = await fetchPosts();

  if (!posts) {
    return;
  }

  const batches = chunk(posts.filter(filterUnpublished));
  const total = batches.length;

  // Ensure the first batch is submitted before sending the rest en masse
  const [first, ...rest] = batches;
  const last = rest.pop();
  console.info(`Syncing Slab posts batch 1 of ${total} to Glean (FIRST)`);
  await syncDocuments(first.map(mapPostToGlean), DataSource.name, uploadId, PAGE.first);
  
  const requests = rest.map(async (docs, index) => {
    const oneIndex = index + 2;
    
    console.info(`Syncing Slab posts batch ${oneIndex} of ${total} to Glean`);
    await syncDocuments(docs.map(mapPostToGlean), DataSource.name, uploadId);
  });
  await Promise.all(requests);

  // Ensure the last batch is submitted AFTER the rest is sent en masse
  if (last) {
    console.info(`Syncing Slab posts batch 1 of ${total} to Glean (LAST)`);
    await syncDocuments(last.map(mapPostToGlean), DataSource.name, uploadId, PAGE.last);
  }

  try {
    await forceProcessing(DataSource.name);
  } catch (error: any) {
    console.warn(error?.response?.body ?? 'Failed to force indexing');
  }
  console.info('Finishes posts sync');
}
