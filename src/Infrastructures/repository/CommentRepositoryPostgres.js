const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const CommentRepository = require('../../Domains/comments/CommentRepository');
const CreatedComment = require('../../Domains/comments/entities/AddedComment');

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment(addComment) {
    const { content, owner, threadId } = addComment;
    const id = `comment-${this._idGenerator()}`;
    const date = new Date().toISOString();

    const query = {
      text: 'INSERT INTO comments(id, content, owner, thread, created_at, updated_at) VALUES($1, $2, $3, $4, $5, $6) RETURNING id, content, owner',
      values: [id, content, owner, threadId, date, date],
    };

    const result = await this._pool.query(query);

    return new CreatedComment({ ...result.rows[0] });
  }

  async verifyAvailableIdComment(commentId) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [commentId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('komentar tidak ditemukan');
    }
  }

  async isTrueOwner(commentId, owner) {
    
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1 AND owner = $2',
      values: [commentId, owner],
    };

    const result = await this._pool.query(query);
    console.log(result.rowCount)
    if (!result.rowCount) {
      throw new AuthorizationError('akses dilarang!');
    }
  }

  async deleteComment(commentId) {
    const query = {
      text: 'UPDATE comments SET is_delete = true WHERE id = $1',
      values: [commentId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('komentar tidak ditemukan');
    }
  }

  async getCommentsByThreadId(threadId) {
    const query = {
      text: `
        SELECT comments.id, users.username, comments.created_at, comments.content, comments.is_delete
        FROM comments
        INNER JOIN users ON comments.owner = users.id
        WHERE comments.thread = $1
        ORDER BY comments.created_at ASC
      `,
      values: [threadId],
    };

    const result = await this._pool.query(query);

    return result.rows;
  }
}

module.exports = CommentRepositoryPostgres;
