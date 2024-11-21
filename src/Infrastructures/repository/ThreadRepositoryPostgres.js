const NotFoundError = require("../../Commons/exceptions/NotFoundError");
const ThreadRepository = require("../../Domains/threads/ThreadRepository");
const AddedThread = require("../../Domains/threads/entities/AddedThread");

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async createThread(userId, createdThread) {
    console.log("addThread-postgres", createdThread);

    const { title, body } = createdThread;
    const id = `thread-${this._idGenerator()}`;
    const date = new Date().toISOString();

    console.log("addThread-postgres2", createdThread);
    console.log("addThread-postgres2-id", id);
    console.log("addThread-postgres2-date", date);

    const query = {
      text: "INSERT INTO threads VALUES($1, $2, $3, $4, $5) RETURNING id, title, owner",
      values: [id, title, body, date, userId],
    };

    const result = await this._pool.query(query);

    return new AddedThread(result.rows[0]);
  }

  async fetchThreadById(id) {
    const query = {
      text: "SELECT threads.id, threads.title, threads.body, threads.date::text, users.username FROM threads LEFT JOIN users ON users.id = threads.owner WHERE threads.id = $1",
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError("thread tidak ditemukan");
    }

    return result.rows[0];
  }

  async verifyThreadExists(id) {
    const query = {
      text: "SELECT id FROM threads WHERE id = $1",
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError("thread tidak ditemukan");
    }
  }
}

module.exports = ThreadRepositoryPostgres;
