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
    }
  }
`;

export const updatePost = /* GraphQL */ `
  mutation updatePost($id: ID!, $input: PostInput) {
    updatePost(id: $id, input: $input) {
      title
      tags
      desc
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
    }
  }
`;

export const deletePostQuery = /* GraphQL */ `
  mutation deletePost($id: ID!) {
    deletePost(id: $id)
  }
`;

export const uploadPost = /* GraphQL */ `
  mutation singleUpload($file: Upload!) {
    uploadFile(file: $file)
  }
`;
