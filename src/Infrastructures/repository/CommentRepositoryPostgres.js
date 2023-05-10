const ThreadRepository = require('../../Domains/threads/ThreadRepository');
const AddedCommentThread = require('../../Domains/comments/entities/AddedCommentThread');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');

class CommentRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async getComments(id) {
    const query = {
      text: `SELECT 
               c.id, u.username, c.created_at AS date, c.content, c.is_delete
              FROM comments c
              LEFT JOIN users u ON c.owner = u.id
              WHERE c.thread_id = $1`,
      values: [id],
    };
    const result = await this._pool.query(query);
    return result.rows;
  }

  async addComment(newComment) {
    const { threadId, content, owner } = newComment;
    const id = `comment-${this._idGenerator()}`;
    const date = new Date().toISOString();
    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5, $6) RETURNING id, content, owner',
      values: [id, threadId, content, owner, false, date],
    };

    const result = await this._pool.query(query);

    return new AddedCommentThread({ ...result.rows[0] });
  }

  async verifyCommentOwner(id, owner) {
    const query = {
      text: 'SELECT * FROM comments WHERE id=$1 AND owner=$2',
      values: [id, owner],
    };

    const result = await this._pool.query(query);
    if (!result.rows[0]) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
    }
  }

  async verifyAvailableComment(id) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);
    if (!result.rows[0]) {
      throw new NotFoundError('comment tidak tersedia');
    }
  }

  async deleteComment(id) {
    const query = {
      text: 'UPDATE comments SET is_delete=$1 WHERE id=$2 RETURNING *',
      values: [true, id],
    };

    const result = await this._pool.query(query);
    if (!result.rows[0]) {
      throw new NotFoundError('comment tidak tersedia');
    }
  }
}

module.exports = CommentRepositoryPostgres;
