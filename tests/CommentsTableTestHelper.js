/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const CommentsTableTestHelper = {
  async addComment({
    id = '1',
    thread_id = 'thread-1',
    content = 'testing',
    owner = 'user-1',
    created_at = new Date().toISOString(),
  }) {
    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5, $6) RETURNING *',
      values: [id, thread_id, content, owner, false, created_at],
    };
    await pool.query(query);
  },

  async deleteComment(id) {
    const query = {
      text: 'UPDATE comments SET is_delete=$1 WHERE id=$2 RETURNING *',
      values: [true, id],
    };

    await pool.query(query);
  },

  async cleanTable() {
    await pool.query('DELETE FROM comments WHERE 1=1');
  },
};

module.exports = CommentsTableTestHelper;
