const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const AddThread = require('../../../Domains/threads/entities/AddThread');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');

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
    it('should throw NotFoundError when thread not available', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        threadRepositoryPostgres.getThread('thread-1')
      ).rejects.toThrowError(NotFoundError);
    });

    it('should return thread id correctly', async () => {
      // Arrange
      const date = new Date().toISOString();
      await ThreadsTableTestHelper.addThreads({
        id: 'thread-2',
        title: 'testing',
        body: 'testing',
        created_at: date,
      });
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action
      const thread = await threadRepositoryPostgres.getThread('thread-2');

      // Assert
      expect(thread.id).toStrictEqual('thread-2');
      expect(thread.title).toStrictEqual('testing');
      expect(thread.body).toStrictEqual('testing');
      expect(thread.date).toStrictEqual(date);
      expect(thread.username).toStrictEqual(null);
    });
  });
});
