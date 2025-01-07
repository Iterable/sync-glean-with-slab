import { gql } from 'graphql-request';

import { slabApi } from './api.js';

interface ContentOwner {
  id: string;
}

export enum LinkAccess {
  disabled = 'DISABLED',
  internal = 'INTERNAL',
  public = 'PUBLIC',
}

interface PostContentAttributes {
  author?: string;
  bold?: boolean;
  list?: 'bullet';
  link?: string;
}

export interface PostContent {
  attributes?: PostContentAttributes;
  insert: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  publishedAt?: string;
  updatedAt?: string;
  archivedAt?: string;
  linkAccess: LinkAccess;
  owner: ContentOwner;
}

interface PostIdsResponse {
  organization: {
    posts: Post[];
  };
}

const postIdsQuery = gql`
  {
    organization {
      posts {
        id
      }
    }
  }
`;

export const getPostIds = async () => {
  const results = await slabApi.request<PostIdsResponse>(postIdsQuery);

  return results.organization.posts.map(v => v.id);
};

interface PostsResponse {
  posts: Post[];
}

const postsQuery = gql`
  query ($ids: [ID!]!) {
      posts(ids: $ids) {
        id
        title
        content
        publishedAt
        updatedAt
        archivedAt
        linkAccess
        owner {
          id
        }
      }
  }
`;

export const getPosts = async (ids: string[]) => {
  const results = await slabApi.request<PostsResponse>(postsQuery, { ids });

  return results.posts;
};

interface PostResponse {
  post: Post;
}

const getPostQuery = gql`
  query ($id: ID!) {
    post(id: $id) {
      id
      title
      content
      publishedAt
      updatedAt
      archivedAt
      linkAccess
      owner {
        id
      }
    }
  }
`;

export const getPost = async (id: string) => {
  const results = await slabApi.request<PostResponse>(getPostQuery, { id });

  return results.post;
};
