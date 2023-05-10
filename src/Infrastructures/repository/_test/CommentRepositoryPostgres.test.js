const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const pool = require('../../database/postgres/pool');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const AddCommentThread = require('../../../Domains/comments/entities/AddCommentThread');
const AddedCommentThread = require('../../../Domains/comments/entities/AddedCommentThread');

describe('CommentRepositoryPostgres', () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('getComments function', () => {
    it('should return comment id correctly', async () => {
      // Arrange
      const date = new Date().toISOString();
      await CommentsTableTestHelper.addComment({
        id: 'comment-1',
        thread_id: 'thread-2',
        created_at: date,
        content: 'testing',
        is_delete: false,
      });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action
      const comments = await commentRepositoryPostgres.getComments('thread-2');

      // Assert
      expect(comments[0].id).toStrictEqual('comment-1');
      expect(comments[0].username).toStrictEqual(null);
      expect(comments[0].date).toStrictEqual(date);
      expect(comments[0].content).toStrictEqual('testing');
      expect(comments[0].is_delete).toStrictEqual(false);
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
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      const registeredComment = await commentRepositoryPostgres.addComment(
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
      await CommentsTableTestHelper.addComment({
        id: 'comment-1',
        thread_id: 'thread-2',
        owner: 'user-1',
      });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      return expect(
        commentRepositoryPostgres.verifyCommentOwner('comment-1', 'user-2')
      ).rejects.toThrowError(AuthorizationError);
    });

    it('should verifyCommentOwner correctly', async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({
        id: 'comment-1',
        thread_id: 'thread-2',
        owner: 'user-1',
      });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      return expect(
        commentRepositoryPostgres.verifyCommentOwner('comment-1', 'user-1')
      ).resolves.not.toThrowError(AuthorizationError);
    });
  });

  describe('verifyAvailableComment function', () => {
    it('should throw NotFound error when comment not found', async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({
        id: 'comment-1',
        thread_id: 'thread-2',
        owner: 'user-1',
      });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      return expect(
        commentRepositoryPostgres.verifyAvailableComment('comment-2')
      ).rejects.toThrowError(NotFoundError);
    });

    it('should verifyAvailableComment correctly', async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({
        id: 'comment-1',
        thread_id: 'thread-2',
        owner: 'user-1',
      });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      return expect(
        commentRepositoryPostgres.verifyAvailableComment('comment-1')
      ).resolves.not.toThrowError(NotFoundError);
    });
  });

  describe('deleteComment function', () => {
    it('should throw NotFound error when comment not found', async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({
        id: 'comment-1',
        thread_id: 'thread-2',
        owner: 'user-1',
      });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      return expect(
        commentRepositoryPostgres.deleteComment('comment-2')
      ).rejects.toThrowError(NotFoundError);
    });

    it('should deleteComment correctly', async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({
        id: 'comment-1',
        thread_id: 'thread-2',
        owner: 'user-1',
      });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      return expect(
        commentRepositoryPostgres.deleteComment('comment-1')
      ).resolves.not.toThrowError(NotFoundError);
    });
  });
});
