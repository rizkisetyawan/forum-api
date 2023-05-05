/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const ThreadsTableTestHelper = {
  async addThreads({
    id = '1',
    title = 'testing',
    body = 'testing',
    owner = 'user-1',
    created_at = new Date().toISOString(),
  }) {
    const query = {
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4, $5) RETURNING *',
      values: [id, title, body, owner, created_at],
    };
    await pool.query(query);
  },

  async addComment({
    id = '1',
    thread_id = 'thread-1',
    content = 'testing',
    owner = 'user-1',
    created_at = new Date().toISOString(),
  }) {
    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5) RETURNING *',
      values: [id, thread_id, content, owner, created_at],
    };
    await pool.query(query);
  },

  async cleanTable() {
    await pool.query('DELETE FROM threads WHERE 1=1');
    await pool.query('DELETE FROM comments WHERE 1=1');
  },
};

module.exports = ThreadsTableTestHelper;
