const ThreadRepository = require('../../Domains/threads/ThreadRepository');
const AddedThread = require('../../Domains/threads/entities/AddedThread');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async verifyAvailableThread(id) {
    const query = {
      text: 'SELECT * FROM threads WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);
    if (!result.rows[0]) {
      throw new NotFoundError('thread tidak tersedia');
    }
  }

  async addThread(newThread) {
    const { title, body, owner } = newThread;
    const id = `thread-${this._idGenerator()}`;
    const date = new Date().toISOString();
    const query = {
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4, $5) RETURNING id, title, owner',
      values: [id, title, body, owner, date],
    };

    const result = await this._pool.query(query);

    return new AddedThread({ ...result.rows[0] });
  }

  async getThread(id) {
    const query = {
      text: `SELECT 
                t.id, t.title, t.body, t.created_at AS date, u.username 
              FROM threads t
              LEFT JOIN users u ON t.owner = u.id
              WHERE t.id = $1`,
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rows[0]) {
      throw new NotFoundError('thread tidak tersedia');
    }
    return result.rows[0];
  }
}

module.exports = ThreadRepositoryPostgres;
