const NotFoundError = require("../../Commons/exceptions/NotFoundError");
const AuthorizationError = require("../../Commons/exceptions/AuthorizationError");
const AddedComment = require("../../Domains/comments/entities/AddedComment");
const CommentRepository = require("../../Domains/comments/CommentRepository");

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async insertComment(userId, threadId, commentData) {
    const { content } = commentData;
    const id = `comment-${this._idGenerator()}`;
    const date = new Date().toISOString();

    const query = {
      text: "INSERT INTO comments VALUES($1, $2, $3, $4, $5) RETURNING id, content, owner",
      values: [id, content, date, threadId, userId],
    };

    const result = await this._pool.query(query);

    return new AddedComment(result.rows[0]);
  }

  async fetchCommentsByThread(threadId) {
    const query = {
      text: "SELECT comments.id, users.username, comments.date, comments.content, comments.is_delete FROM comments LEFT JOIN users ON users.id = comments.owner WHERE comments.thread = $1 ORDER BY comments.date ASC",
      values: [threadId],
    };

    const result = await this._pool.query(query);

    return result.rows;
  }

  async removeCommentById(commentId) {
    const query = {
      text: "UPDATE comments SET is_delete = true WHERE id = $1",
      values: [commentId],
    };

    await this._pool.query(query);
  }

  async isCommentAvailable(commentId, threadId) {
    const query = {
      text: "SELECT id, is_delete, thread FROM comments WHERE id = $1",
      values: [commentId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError("komentar tidak ditemukan");
    }

    if (result.rows[0].is_delete) {
      throw new NotFoundError("komentar tidak valid");
    }

    if (result.rows[0].thread !== threadId) {
      throw new NotFoundError("komentar dalam thread tidak ditemukan");
    }
  }

  async validateCommentOwner(commentId, owner) {
    const query = {
      text: "SELECT owner FROM comments WHERE id = $1",
      values: [commentId],
    };

    const result = await this._pool.query(query);
    const comment = result.rows[0];

    if (comment.owner !== owner) {
      throw new AuthorizationError("akses dilarang");
    }
  }
}
module.exports = CommentRepositoryPostgres;
