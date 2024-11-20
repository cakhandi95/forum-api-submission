const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const NotFoundError = require("../../../Commons/exceptions/NotFoundError");
const CreatedThread = require("../../../Domains/threads/entities/CreatedThread");
const AddedThread = require("../../../Domains/threads/entities/AddedThread");
const pool = require("../../database/postgres/pool");
const ThreadRepositoryPostgres = require("../ThreadRepositoryPostgres");

describe("ThreadRepositoryPostgres", () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe("checkThreadAvailability function", () => {
    it("should throw NotFoundError when thread not available", async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        threadRepositoryPostgres.checkThreadAvailability("thread-123")
      ).rejects.toThrowError(NotFoundError);
    });

    it("should not throw NotFoundError when thread available", async () => {
      // Arrange
      const userId = "user-123";
      const threadId = "thread-123";

      await UsersTableTestHelper.addUser({ id: userId });
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        threadRepositoryPostgres.checkThreadAvailability(threadId)
      ).resolves.not.toThrowError(NotFoundError);
    });
  });

  describe("addThread function", () => {
    beforeEach(async () => {
      await UsersTableTestHelper.addUser({ id: "user-123" });
    });

    it("should persist new thread", async () => {
      // Arrange
      const createdThread = new CreatedThread({
        title: "A thread", // Berikan nilai title yang valid
        body: "A long thread", // Berikan nilai body yang valid
      });

      const fakeIdGenerator = () => "123"; // Mock ID generator
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      await threadRepositoryPostgres.addThread("user-123", createdThread);

      // Assert
      const threads = await ThreadsTableTestHelper.findThreadsById(
        "thread-123"
      );
      expect(threads).toHaveLength(1);
      expect(threads[0].title).toBe("A thread");
      expect(threads[0].body).toBe("A long thread");
    });

    it("should return added thread correctly", async () => {
      // Arrange
      const createdThread = new CreatedThread({
        title: "A thread", // Pastikan title valid
        body: "A long thread", // Pastikan body valid
      });

      const fakeIdGenerator = () => "123";
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      console.log("step1", createdThread);

      // Action
      const addedThread = await threadRepositoryPostgres.addThread(
        "user-123",
        createdThread
      );

      console.log("step2", createdThread);
      console.log("step2-addthread", addedThread);

      // Assert
      expect(addedThread).toStrictEqual(
        new AddedThread({
          id: "thread-123",
          title: "A thread",
          owner: "user-123",
        })
      );
    });
  });

  describe("getThreadById function", () => {
    it("should throw NotFoundError when thread not found", async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        threadRepositoryPostgres.getThreadById("thread-123")
      ).rejects.toThrowError(NotFoundError);
    });

    it("should return thread correctly", async () => {
      // Arrange
      const userId = "user-123";
      const threadId = "thread-123";
      const date = new Date().toISOString();

      await UsersTableTestHelper.addUser({ id: userId, username: "foobar" });
      await ThreadsTableTestHelper.addThread({
        id: threadId,
        title: "A thread",
        body: "A long thread",
        date,
        owner: userId,
      });

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action
      const thread = await threadRepositoryPostgres.getThreadById(threadId);

      // Assert
      expect(thread.id).toStrictEqual(threadId);
      expect(thread.title).toStrictEqual("A thread");
      expect(thread.body).toStrictEqual("A long thread");
      expect(thread.date).toBeTruthy();
      expect(thread.username).toStrictEqual("foobar");
    });
  });
});
