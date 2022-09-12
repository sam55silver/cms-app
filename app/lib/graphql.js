import { GraphQLClient } from 'graphql-request';

export const client = new GraphQLClient(
  'http://localhost:5001/cms-app-1a47d/us-central1/server/graphql'
);

export const getPost = /* GraphQL */ `
  query getPost($id: ID!) {
    getPost(id: $id) {
      title
      tags
      desc
      files
    }
  }
`;

export const getPosts = /* GraphQL */ `
  query getPosts {
    getPosts {
      title
      tags
      desc
      id
      files {
        uri
      }
    }
  }
`;

export const updatePost = /* GraphQL */ `
  mutation updatePost($id: ID!, $input: PostInput) {
    updatePost(id: $id, input: $input) {
      title
      tags
      desc
      files
    }
  }
`;

export const createPost = /* GraphQL */ `
  mutation createPost($input: PostInput) {
    createPost(input: $input) {
      title
      tags
      desc
      id
      files {
        uri
        fileName
      }
    }
  }
`;

export const deletePostQuery = /* GraphQL */ `
  mutation deletePost($id: ID!) {
    deletePost(id: $id)
  }
`;
