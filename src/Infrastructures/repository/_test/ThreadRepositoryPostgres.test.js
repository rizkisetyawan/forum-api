const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const AddThread = require('../../../Domains/threads/entities/AddThread');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const AddCommentThread = require('../../../Domains/threads/entities/AddCommentThread');
const AddedCommentThread = require('../../../Domains/threads/entities/AddedCommentThread');

describe('ThreadRepositoryPostgres', () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('verifyAvailableThread function', () => {
    it('should throw NotFoundError when thread not available', async () => {
      // Arrange

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        threadRepositoryPostgres.verifyAvailableThread('thread-1')
      ).rejects.toThrowError(NotFoundError);
    });

    it('should not throw NotFoundError when thread available', async () => {
      // Arrange
      await ThreadsTableTestHelper.addThreads({ id: 'thread-1' });
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        threadRepositoryPostgres.verifyAvailableThread('thread-1')
      ).resolves.not.toThrowError(NotFoundError);
    });
  });

  describe('addThread function', () => {
    it('should return registered thread correctly', async () => {
      // Arrange
      const registerThread = new AddThread({
        title: 'testing',
        body: 'testing',
        owner: 'user-1',
      });
      const fakeIdGenerator = () => '123'; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      const registeredThread = await threadRepositoryPostgres.addThread(
        registerThread
      );

      // Assert
      expect(registeredThread).toStrictEqual(
        new AddedThread({
          id: 'thread-123',
          title: 'testing',
          owner: 'user-1',
        })
      );
    });
  });

  describe('getThread function', () => {
    it('should return thread id correctly', async () => {
      // Arrange
      await ThreadsTableTestHelper.addThreads({ id: 'thread-2' });
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action
      const thread = await threadRepositoryPostgres.getThread('thread-2');

      // Assert
      expect(thread.id).toEqual('thread-2');
    });
  });

  describe('getComments function', () => {
    it('should return comment id correctly', async () => {
      // Arrange
      await ThreadsTableTestHelper.addComment({
        id: 'comment-1',
        thread_id: 'thread-2',
      });
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action
      const comments = await threadRepositoryPostgres.getComments('thread-2');

      // Assert
      expect(comments[0].id).toEqual('comment-1');
    });
  });

  describe('addComment function', () => {
    it('should return new comment correctly', async () => {
      // Arrange
      const registerComment = new AddCommentThread({
        threadId: 'thread-1',
        content: 'testing',
        owner: 'user-1',
      });
      const fakeIdGenerator = () => '123'; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      const registeredComment = await threadRepositoryPostgres.addComment(
        registerComment
      );

      // Assert
      expect(registeredComment).toStrictEqual(
        new AddedCommentThread({
          id: 'comment-123',
          content: 'testing',
          owner: 'user-1',
        })
      );
    });
  });

  describe('verifyCommentOwner function', () => {
    it('should throw Authorization error when owner not match', async () => {
      // Arrange
      await ThreadsTableTestHelper.addComment({
        id: 'comment-1',
        thread_id: 'thread-2',
        owner: 'user-1',
      });

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      return expect(
        threadRepositoryPostgres.verifyCommentOwner('comment-1', 'user-2')
      ).rejects.toThrowError(AuthorizationError);
    });

    it('should verifyCommentOwner correctly', async () => {
      // Arrange
      await ThreadsTableTestHelper.addComment({
        id: 'comment-1',
        thread_id: 'thread-2',
        owner: 'user-1',
      });

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      return expect(
        threadRepositoryPostgres.verifyCommentOwner('comment-1', 'user-1')
      ).resolves.not.toThrowError(AuthorizationError);
    });
  });

  describe('verifyAvailableComment function', () => {
    it('should throw NotFound error when comment not found', async () => {
      // Arrange
      await ThreadsTableTestHelper.addComment({
        id: 'comment-1',
        thread_id: 'thread-2',
        owner: 'user-1',
      });

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      return expect(
        threadRepositoryPostgres.verifyAvailableComment('comment-2')
      ).rejects.toThrowError(NotFoundError);
    });

    it('should verifyAvailableComment correctly', async () => {
      // Arrange
      await ThreadsTableTestHelper.addComment({
        id: 'comment-1',
        thread_id: 'thread-2',
        owner: 'user-1',
      });

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      return expect(
        threadRepositoryPostgres.verifyAvailableComment('comment-1')
      ).resolves.not.toThrowError(NotFoundError);
    });
  });

  describe('deleteComment function', () => {
    it('should throw NotFound error when comment not found', async () => {
      // Arrange
      await ThreadsTableTestHelper.addComment({
        id: 'comment-1',
        thread_id: 'thread-2',
        owner: 'user-1',
      });

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      return expect(
        threadRepositoryPostgres.deleteComment('comment-2')
      ).rejects.toThrowError(NotFoundError);
    });

    it('should deleteComment correctly', async () => {
      // Arrange
      await ThreadsTableTestHelper.addComment({
        id: 'comment-1',
        thread_id: 'thread-2',
        owner: 'user-1',
      });

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      return expect(
        threadRepositoryPostgres.deleteComment('comment-1')
      ).resolves.not.toThrowError(NotFoundError);
    });
  });
});
