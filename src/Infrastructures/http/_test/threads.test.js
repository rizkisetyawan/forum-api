const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');
const AuthenticationTokenManager = require('../../../Applications/security/AuthenticationTokenManager');

describe('/threads endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
  });

  describe('when GET /threads', () => {
    it('should response 404 if thread not found', async () => {
      // Arrange
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'GET',
        url: '/threads/xxx',
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toBeDefined();
    });

    it('should response 200 and get thread', async () => {
      // Arrange
      const server = await createServer(container);

      // Action
      await ThreadsTableTestHelper.addThreads({ id: 'thread-1' });
      await ThreadsTableTestHelper.addComment({
        id: 'comment-1',
        thread_id: 'thread-1',
        owner: 'user-1',
        content: 'testing',
      });
      await ThreadsTableTestHelper.addComment({
        id: 'comment-2',
        thread_id: 'thread-1',
        owner: 'user-1',
        content: 'testing 2',
      });
      await ThreadsTableTestHelper.deleteComment('comment-2');
      const response = await server.inject({
        method: 'GET',
        url: '/threads/thread-1',
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.thread).toBeDefined();
      expect(responseJson.data.thread.comments).toBeDefined();
      expect(responseJson.data.thread.comments[0].content).toEqual('testing');
      expect(responseJson.data.thread.comments[1].content).toEqual(
        '**komentar telah dihapus**'
      );
    });
  });

  describe('when POST /threads', () => {
    it('should response 401 if No Authentication', async () => {
      // Arrange & Action
      const server = await createServer(container);
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {},
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.error).toEqual('Unauthorized');
      expect(responseJson.message).toEqual('Missing authentication');
    });

    it('should response 400 if thread payload not contain needed property', async () => {
      // Arrange
      const requestPayload = {
        title: 'dicoding',
      };
      const server = await createServer(container);

      // Action
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });
      const responseToken = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: { username: 'dicoding', password: 'secret' },
      });
      const responseTokenJson = JSON.parse(responseToken.payload);
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          Authorization: 'Bearer ' + responseTokenJson.data.accessToken,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toBeDefined();
    });

    it('should response 201 and new thread', async () => {
      // Arrange
      const requestPayload = {
        title: 'dicoding',
        body: 'dicoding',
      };
      const server = await createServer(container);

      // Action
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });
      const responseToken = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: { username: 'dicoding', password: 'secret' },
      });
      const responseTokenJson = JSON.parse(responseToken.payload);
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          Authorization: 'Bearer ' + responseTokenJson.data.accessToken,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data).toBeDefined();
    });
  });

  describe('when POST /threads/{id}/comments', () => {
    it('should response 401 if No Authentication', async () => {
      // Arrange & Action
      const server = await createServer(container);
      const response = await server.inject({
        method: 'POST',
        url: '/threads/xxx/comments',
        payload: {},
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.error).toEqual('Unauthorized');
      expect(responseJson.message).toEqual('Missing authentication');
    });

    it('should response 404 if thread not found', async () => {
      // Arrange
      const requestPayload = {
        content: 'dicoding',
      };
      const server = await createServer(container);

      // Action
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });
      const responseToken = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: { username: 'dicoding', password: 'secret' },
      });
      const responseTokenJson = JSON.parse(responseToken.payload);
      const response = await server.inject({
        method: 'POST',
        url: '/threads/xxx/comments',
        payload: requestPayload,
        headers: {
          Authorization: 'Bearer ' + responseTokenJson.data.accessToken,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toBeDefined();
    });

    it('should response 400 if comment payload not contain needed property', async () => {
      // Arrange
      const requestPayload = {};
      const server = await createServer(container);

      // Action
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });
      const responseToken = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: { username: 'dicoding', password: 'secret' },
      });
      const responseTokenJson = JSON.parse(responseToken.payload);
      const response = await server.inject({
        method: 'POST',
        url: '/threads/xxx/comments',
        payload: requestPayload,
        headers: {
          Authorization: 'Bearer ' + responseTokenJson.data.accessToken,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toBeDefined();
    });

    it('should response 201 and delete comment', async () => {
      // Arrange
      const requestPayload = {
        content: 'dicoding',
      };
      const server = await createServer(container);

      // Action
      await ThreadsTableTestHelper.addThreads({ id: 'thread-1' });
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });
      const responseToken = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: { username: 'dicoding', password: 'secret' },
      });
      const responseTokenJson = JSON.parse(responseToken.payload);
      const responseComment = await server.inject({
        method: 'POST',
        url: '/threads/thread-1/comments',
        payload: requestPayload,
        headers: {
          Authorization: 'Bearer ' + responseTokenJson.data.accessToken,
        },
      });
      const responseCommentJson = JSON.parse(responseComment.payload);
      const responseDelete = await server.inject({
        method: 'DELETE',
        url: `/threads/thread-1/comments/${responseCommentJson.data.addedComment.id}`,
        payload: requestPayload,
        headers: {
          Authorization: 'Bearer ' + responseTokenJson.data.accessToken,
        },
      });
      // Assert
      const responseJson = JSON.parse(responseDelete.payload);
      expect(responseJson.status).toEqual('success');
    });
  });

  describe('when DELETE /threads/{id}/comments/{id}', () => {
    it('should response 401 if No Authentication', async () => {
      // Arrange & Action
      const server = await createServer(container);
      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/xxx/comments/xxx',
        payload: {},
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.error).toEqual('Unauthorized');
      expect(responseJson.message).toEqual('Missing authentication');
    });

    it('should response 403 if No Authorization', async () => {
      // Arrange & Action

      const server = await createServer(container);
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });
      const responseToken = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: { username: 'dicoding', password: 'secret' },
      });
      const responseTokenJson = JSON.parse(responseToken.payload);
      await ThreadsTableTestHelper.addThreads({ id: 'thread-1' });
      await ThreadsTableTestHelper.addComment({
        id: 'comment-1',
        thread_id: 'thread-1',
        owner: 'user-1',
      });
      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-1/comments/comment-1',
        headers: {
          Authorization: 'Bearer ' + responseTokenJson.data.accessToken,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(403);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toBeDefined();
    });

    it('should response 404 if thread or comment not found', async () => {
      // Arrange & Action
      const server = await createServer(container);
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });
      const responseToken = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: { username: 'dicoding', password: 'secret' },
      });
      const responseTokenJson = JSON.parse(responseToken.payload);
      await ThreadsTableTestHelper.addThreads({ id: 'thread-1' });
      await ThreadsTableTestHelper.addComment({
        id: 'comment-1',
        thread_id: 'thread-1',
        owner: 'user-1',
      });
      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-1/comments/comment-2',
        headers: {
          Authorization: 'Bearer ' + responseTokenJson.data.accessToken,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toBeDefined();
    });
  });
});
