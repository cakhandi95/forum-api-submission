const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const ReplyTableTestHelper = require("../../../../tests/ReplyTableTestHelper");
const NotFoundError = require("../../../Commons/exceptions/NotFoundError");
const AuthorizationError = require("../../../Commons/exceptions/AuthorizationError");
const CreatedReply = require("../../../Domains/replies/entities/CreatedReply");
const AddedReply = require("../../../Domains/replies/entities/AddedReply");
const pool = require("../../database/postgres/pool");
const ReplyRepositoryPostgres = require("../ReplyRepositoryPostgres");

describe("ReplyRepositoryPostgres", () => {
  afterEach(async () => {
    await ReplyTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe("isReplyAvailable function", () => {
    it("should throw NotFoundError when reply not available", async () => {
      // Arrange
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        replyRepositoryPostgres.isReplyAvailable("reply-123")
      ).rejects.toThrowError(new NotFoundError("balasan tidak ditemukan"));
    });

    it("should throw NotFoundError when reply is deleted", async () => {
      // Arrange
      const userId = "user-123";
      const threadId = "thread-123";
      const commentId = "comment-123";
      const replyId = "reply-123";

      await UsersTableTestHelper.addUser({ id: userId });
      await ThreadsTableTestHelper.createdThread({
        id: threadId,
        owner: userId,
      });
      await CommentsTableTestHelper.insertComment({
        id: commentId,
        thread: threadId,
        owner: userId,
      });
      await ReplyTableTestHelper.createReply({
        id: replyId,
        comment: commentId,
        owner: userId,
        isDelete: true, // reply is soft deleted
      });

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        replyRepositoryPostgres.isReplyAvailable("reply-123", commentId)
      ).rejects.toThrowError(new NotFoundError("balasan tidak valid"));
    });

    it("should throw NotFoundError when reply is npt found in comment", async () => {
      // Arrange
      const userId = "user-123";
      const threadId = "thread-123";
      const commentId = "comment-123";
      const replyId = "reply-123";

      await UsersTableTestHelper.addUser({ id: userId });
      await ThreadsTableTestHelper.createdThread({
        id: threadId,
        owner: userId,
      });
      await CommentsTableTestHelper.insertComment({
        id: commentId,
        thread: threadId,
        owner: userId,
      });
      await ReplyTableTestHelper.createReply({
        id: replyId,
        comment: commentId,
        owner: userId,
      });

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        replyRepositoryPostgres.isReplyAvailable("reply-123", "other-comment")
      ).rejects.toThrowError(
        new NotFoundError("balasan dalam komentar tidak ditemukan")
      );
    });

    it("should not throw NotFoundError when reply available", async () => {
      // Arrange
      const userId = "user-123";
      const threadId = "thread-123";
      const commentId = "comment-123";
      const replyId = "reply-123";

      await UsersTableTestHelper.addUser({ id: userId });
      await ThreadsTableTestHelper.createdThread({
        id: threadId,
        owner: userId,
      });
      await CommentsTableTestHelper.insertComment({
        id: commentId,
        thread: threadId,
        owner: userId,
      });
      await ReplyTableTestHelper.createReply({
        id: replyId,
        comment: commentId,
        owner: userId,
      });

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        replyRepositoryPostgres.isReplyAvailable(replyId, commentId)
      ).resolves.not.toThrowError(NotFoundError);
    });
  });

  describe("confirmReplyOwnership function", () => {
    it("should throw AuthorizationError when reply owner not authorized", async () => {
      // Arrange
      const userId = "user-123";
      const threadId = "thread-123";
      const commentId = "comment-123";
      const replyId = "reply-123";

      await UsersTableTestHelper.addUser({ id: userId });
      await ThreadsTableTestHelper.createdThread({
        id: threadId,
        owner: userId,
      });
      await CommentsTableTestHelper.insertComment({
        id: commentId,
        thread: threadId,
        owner: userId,
      });
      await ReplyTableTestHelper.createReply({
        id: replyId,
        comment: commentId,
        owner: userId,
      });

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        replyRepositoryPostgres.confirmReplyOwnership(replyId, "user-other")
      ).rejects.toThrowError(AuthorizationError);
    });

    it("should not throw AuthorizationError when reply owner authorized", async () => {
      // Arrange
      const userId = "user-123";
      const threadId = "thread-123";
      const commentId = "comment-123";
      const replyId = "reply-123";

      await UsersTableTestHelper.addUser({ id: userId });
      await ThreadsTableTestHelper.createdThread({
        id: threadId,
        owner: userId,
      });
      await CommentsTableTestHelper.insertComment({
        id: commentId,
        thread: threadId,
        owner: userId,
      });
      await ReplyTableTestHelper.createReply({
        id: replyId,
        comment: commentId,
        owner: userId,
      });

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        replyRepositoryPostgres.confirmReplyOwnership(replyId, userId)
      ).resolves.not.toThrowError(AuthorizationError);
    });
  });

  describe("addReply function", () => {
    beforeEach(async () => {
      await UsersTableTestHelper.addUser({ id: "user-123" });
      await ThreadsTableTestHelper.createdThread({
        id: "thread-123",
        owner: "user-123",
      });
      await CommentsTableTestHelper.insertComment({
        id: "comment-123",
        thread: "thread-123",
        owner: "user-123",
      });
    });

    it("should persist new reply", async () => {
      // Arrange
      const newReply = new CreatedReply({ content: "A reply" });

      const fakeIdGenerator = () => "123";
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      await replyRepositoryPostgres.createReply(
        "user-123",
        "comment-123",
        newReply
      );

      // Assert
      const replys = await ReplyTableTestHelper.findRepliesById("reply-123");
      expect(replys).toHaveLength(1);
    });

    it("should return added reply correctly", async () => {
      // Arrange
      const newReply = new CreatedReply({ content: "A reply" });

      const fakeIdGenerator = () => "123";
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      const addedReply = await replyRepositoryPostgres.createReply(
        "user-123",
        "comment-123",
        newReply
      );

      // Assert
      expect(addedReply).toStrictEqual(
        new AddedReply({
          id: "reply-123",
          content: "A reply",
          owner: "user-123",
        })
      );
    });
  });

  describe("getRepliesByCommentId function", () => {
    it("should return comment replies correctly", async () => {
      // Arrange
      const userId = "user-123";
      const otherUserId = "user-456";
      const threadId = "thread-123";
      const commentId = "comment-123";

      await UsersTableTestHelper.addUser({ id: userId, username: "foobar" });
      await UsersTableTestHelper.addUser({
        id: otherUserId,
        username: "johndoe",
      });
      await ThreadsTableTestHelper.createdThread({
        id: threadId,
        owner: userId,
      });
      await CommentsTableTestHelper.insertComment({
        id: commentId,
        content: "A comment",
        date: "2023-09-09",
        thread: threadId,
        owner: userId,
      });

      await ReplyTableTestHelper.createReply({
        id: "reply-new",
        content: "A new reply",
        date: "2023-09-11",
        comment: commentId,
        owner: userId,
      });
      await ReplyTableTestHelper.createReply({
        id: "reply-old",
        content: "An old reply",
        date: "2023-09-10",
        comment: commentId,
        owner: otherUserId,
      });

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action
      const replies = await replyRepositoryPostgres.fetchRepliesByCommentId(
        commentId
      );

      // Assert
      expect(replies).toHaveLength(2);
      expect(replies[0].id).toBe("reply-old"); // older reply first
      expect(replies[1].id).toBe("reply-new");
      expect(replies[0].username).toBe("johndoe");
      expect(replies[1].username).toBe("foobar");
      expect(replies[0].content).toBe("An old reply");
      expect(replies[1].content).toBe("A new reply");
      expect(replies[0].date).toBeTruthy();
      expect(replies[1].date).toBeTruthy();
    });
  });

  describe("getRepliesByCommentId function", () => {
    it("should return comment replies correctly", async () => {
      // Arrange
      const userId = "user-123";
      const otherUserId = "user-456";
      const threadId = "thread-123";
      const commentId = "comment-123";

      await UsersTableTestHelper.addUser({ id: userId, username: "foobar" });
      await UsersTableTestHelper.addUser({
        id: otherUserId,
        username: "johndoe",
      });
      await ThreadsTableTestHelper.createdThread({
        id: threadId,
        owner: userId,
      });
      await CommentsTableTestHelper.insertComment({
        id: commentId,
        content: "A comment",
        date: "2023-09-09",
        thread: threadId,
        owner: userId,
      });

      await ReplyTableTestHelper.createReply({
        id: "reply-new",
        content: "A new reply",
        date: "2023-09-11",
        comment: commentId,
        owner: userId,
        is_delete: false,
      });
      await ReplyTableTestHelper.createReply({
        id: "reply-old",
        content: "An old reply",
        date: "2023-09-10",
        comment: commentId,
        owner: otherUserId,
        is_delete: false,
      });

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action
      const replies = await replyRepositoryPostgres.fetchRepliesByCommentId(
        commentId
      );

      // Assert
      expect(replies).toHaveLength(2);

      // Assert detail for first reply
      expect(replies[0]).toStrictEqual({
        id: "reply-old",
        content: "An old reply",
        date: new Date("2023-09-09T17:00:00.000Z"), // Correct date format
        username: "johndoe",
        is_delete: false,
      });

      // Assert detail for second reply
      expect(replies[1]).toStrictEqual({
        id: "reply-new",
        content: "A new reply",
        date: new Date("2023-09-10T17:00:00.000Z"), // Correct date format
        username: "foobar",
        is_delete: false,
      });
    });
  });

  describe("getRepliesByThreadId function", () => {
    it("should return comment replies correctly", async () => {
      // Arrange
      const userId = "user-123";
      const otherUserId = "user-456";
      const threadId = "thread-123";
      const commentId = "comment-123";

      await UsersTableTestHelper.addUser({ id: userId, username: "foobar" });
      await UsersTableTestHelper.addUser({
        id: otherUserId,
        username: "johndoe",
      });
      await ThreadsTableTestHelper.createdThread({
        id: threadId,
        owner: userId,
      });
      await CommentsTableTestHelper.insertComment({
        id: commentId,
        content: "A comment",
        date: "2023-09-09",
        thread: threadId,
        owner: userId,
      });
      await CommentsTableTestHelper.insertComment({
        id: "comment-2",
        content: "A comment",
        date: "2023-09-09",
        thread: threadId,
        owner: userId,
        isDelete: true,
      });

      await ReplyTableTestHelper.createReply({
        id: "reply-new",
        content: "A new reply",
        date: "2023-09-11",
        comment: commentId,
        owner: userId,
      });
      await ReplyTableTestHelper.createReply({
        id: "reply-old",
        content: "An old reply",
        date: "2023-09-10",
        comment: commentId,
        owner: otherUserId,
      });
      await ReplyTableTestHelper.createReply({
        id: "reply-old-2",
        content: "An old reply",
        date: "2023-09-09",
        comment: "comment-2",
        owner: otherUserId,
      });

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action
      const replies = await replyRepositoryPostgres.retrieveRepliesByThreadId(
        threadId
      );

      // Assert
      expect(replies).toHaveLength(2);
      expect(replies[0].id).toBe("reply-old"); // older reply first
      expect(replies[1].id).toBe("reply-new");
      expect(replies[0].username).toBe("johndoe");
      expect(replies[1].username).toBe("foobar");
      expect(replies[0].content).toBe("An old reply");
      expect(replies[1].content).toBe("A new reply");
      expect(replies[0].date).toBeTruthy();
      expect(replies[1].date).toBeTruthy();
      expect(replies[2]).toBeUndefined(); // reply in deleted comment
    });
  });

  describe("removeReplyById function", () => {
    it("should soft delete reply and update is_delete field", async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: "user-123" });
      await ThreadsTableTestHelper.createdThread({
        id: "thread-123",
        owner: "user-123",
      });
      await CommentsTableTestHelper.insertComment({
        id: "comment-123",
        thread: "thread-123",
        owner: "user-123",
      });

      const replyId = "reply-123";
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      await ReplyTableTestHelper.createReply({
        id: replyId,
        comment: "comment-123",
        owner: "user-123",
      });

      // Action
      await replyRepositoryPostgres.removeReplyById(replyId);

      // Assert
      const replies = await ReplyTableTestHelper.findRepliesById(replyId);
      expect(replies).toHaveLength(1);
      expect(replies[0].is_delete).toBeTruthy();
    });
  });
});
