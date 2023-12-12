/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const CommentsTableHelper = {
  async addComment({
    id = 'comment-123', content = 'sebuah komentar', owner = 'user-123', thread = 'thread-123', createdAt = '2023-12-08T07:19:09.775Z', updatedAt = '2023-12-08T07:19:09.775Z', isDelete = false,
  }) {
    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5, $6, $7)',
      values: [id, content, owner, thread, createdAt, updatedAt, isDelete],
    };

    await pool.query(query);
  },
  async findCommentsById(id) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [id],
    };
    const result = await pool.query(query);
    return result.rows;
  },
  async checkIsDeletedCommentsById(id) {
    const query = {
      text: 'SELECT is_delete FROM comments WHERE id = $1',
      values: [id],
    };
    const result = await pool.query(query);
    const isDeleted = result.rows[0].is_delete;
    return isDeleted;
  },

  async cleanTable() {
    await pool.query('DELETE FROM comments WHERE 1=1');
  },
};

module.exports = CommentsTableHelper;