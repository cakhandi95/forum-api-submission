const NotFoundError = require("../../Commons/exceptions/NotFoundError");
const AuthorizationError = require("../../Commons/exceptions/AuthorizationError");
const AddedReply = require("../../Domains/replies/entities/AddedReply");
const ReplyRepository = require("../../Domains/replies/ReplyRepository");

class ReplyRepositoryPostgres extends ReplyRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async createReply(userId, commentId, replyData) {
    const { content } = replyData;
    const id = `reply-${this._idGenerator()}`;
    const date = new Date().toISOString();

    const query = {
      text: "INSERT INTO replies VALUES($1, $2, $3, $4, $5) RETURNING id, content, owner",
      values: [id, content, date, commentId, userId],
    };

    const result = await this._pool.query(query);

    return new AddedReply(result.rows[0]);
  }

  async fetchRepliesByCommentId(commentId) {
    const query = {
      text: "SELECT replies.id, users.username, replies.date, replies.content, replies.is_delete FROM replies LEFT JOIN users ON users.id = replies.owner WHERE replies.comment = $1 ORDER BY replies.date ASC",
      values: [commentId],
    };

    const result = await this._pool.query(query);

    return result.rows;
  }

  async retrieveRepliesByThreadId(threadId) {
    const query = {
      text: `SELECT replies.*, users.username 
        FROM replies
        LEFT JOIN users ON users.id = replies.owner
        LEFT JOIN comments ON comments.id = replies.comment
        WHERE comments.thread = $1 AND comments.is_delete = false
        ORDER BY replies.date ASC`,
      values: [threadId],
    };

    const result = await this._pool.query(query);

    return result.rows;
  }

  async removeReplyById(replyId) {
    const query = {
      text: "UPDATE replies SET is_delete = true WHERE id = $1",
      values: [replyId],
    };

    await this._pool.query(query);
  }

  async isReplyAvailable(replyId, commentId) {
    const query = {
      text: "SELECT id, is_delete, comment FROM replies WHERE id = $1",
      values: [replyId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError("balasan tidak ditemukan");
    }

    if (result.rows[0].is_delete) {
      throw new NotFoundError("balasan tidak valid");
    }

    if (result.rows[0].comment !== commentId) {
      throw new NotFoundError("balasan dalam komentar tidak ditemukan");
    }
  }

  async confirmReplyOwnership(replyId, owner) {
    const query = {
      text: "SELECT owner FROM replies WHERE id = $1",
      values: [replyId],
    };

    const result = await this._pool.query(query);
    const reply = result.rows[0];

    if (reply.owner !== owner) {
      throw new AuthorizationError("akses dilarang");
    }
  }
}

module.exports = ReplyRepositoryPostgres;
