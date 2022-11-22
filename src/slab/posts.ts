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

interface PostsResponse {
  organization: {
    posts: Post[];
  };
}

const postsQuery = gql`
  {
    organization {
      posts {
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
  }
`;

export const getPosts = async () => {
  const results = await slabApi.request<PostsResponse>(postsQuery);

  return results.organization.posts;
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
