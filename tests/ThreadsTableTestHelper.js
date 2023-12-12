/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const ThreadsTableHelper = {
  async addThread({
    id = 'thread-123', title = 'sebuah thread', body = 'sebuah body thread', owner = 'user-123', createdAt = 'date test', updatedAt = '2023-09-09T07:19:09.775Z',
  }) {
    const query = {
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4, $5, $6)',
      values: [id, title, body, owner, createdAt, updatedAt],
    };

    await pool.query(query);
  },

  async findThreadsById(id) {
    const query = {
      text: 'SELECT * FROM threads WHERE id = $1',
      values: [id],
    };
    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query('DELETE FROM threads WHERE 1=1');
  },
};

module.exports = ThreadsTableHelper;