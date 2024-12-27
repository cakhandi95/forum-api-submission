const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const NotFoundError = require("../../../Commons/exceptions/NotFoundError");
const AuthenticationError = require("../../../Commons/exceptions/AuthenticationError");
const CreatedComment = require("../../../Domains/comments/entities/CreatedComment");
const AddedComment = require("../../../Domains/comments/entities/AddedComment");
const pool = require("../../database/postgres/pool");
const CommentRepositoryPostgres = require("../CommentRepositoryPostgres");
const AuthorizationError = require("../../../Commons/exceptions/AuthorizationError");

describe("CommentRepositoryPostgres", () => {
  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe("isCommentAvailable function", () => {
    it("should throw NotFoundError when comment not available", async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        commentRepositoryPostgres.isCommentAvailable(
          "comment-123",
          "thread-123"
        )
      ).rejects.toThrowError(new NotFoundError("komentar tidak ditemukan"));
    });

    it("should throw NotFoundError when comment is deleted", async () => {
      // Arrange
      const userId = "user-123";
      const threadId = "thread-123";
      const commentId = "comment-123";

      await UsersTableTestHelper.addUser({ id: userId });
      await ThreadsTableTestHelper.createdThread({
        id: threadId,
        owner: userId,
      });
      await CommentsTableTestHelper.insertComment({
        id: commentId,
        thread: threadId,
        owner: userId,
        isDelete: true, // comment is soft deleted
      });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        commentRepositoryPostgres.isCommentAvailable(commentId, threadId)
      ).rejects.toThrowError(new NotFoundError("komentar tidak valid"));
    });

    it("should throw NotFoundError when comment is not found in thread", async () => {
      // Arrange
      const userId = "user-123";
      const threadId = "thread-123";
      const commentId = "comment-123";

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

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        commentRepositoryPostgres.isCommentAvailable(
          "comment-123",
          "other-thread"
        )
      ).rejects.toThrowError(
        new NotFoundError("komentar dalam thread tidak ditemukan")
      );
    });

    it("should not throw NotFoundError when comment available", async () => {
      // Arrange
      const userId = "user-123";
      const threadId = "thread-123";
      const commentId = "comment-123";

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

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        commentRepositoryPostgres.isCommentAvailable(commentId, threadId)
      ).resolves.not.toThrowError(NotFoundError);
    });
  });

  describe("verifyCommentOwner function", () => {
    it("should throw AuthorizationError when comment owner not authorized", async () => {
      // Arrange
      const userId = "user-123";
      const threadId = "thread-123";
      const commentId = "comment-123";

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

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        commentRepositoryPostgres.validateCommentOwner(commentId, "user-other")
      ).rejects.toThrowError(AuthorizationError);
    });

    it("should not throw AuthorizationError when comment owner authorized", async () => {
      // Arrange
      const userId = "user-123";
      const threadId = "thread-123";
      const commentId = "comment-123";

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

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        commentRepositoryPostgres.validateCommentOwner(commentId, userId)
      ).resolves.not.toThrowError(AuthenticationError);
    });
  });

  describe("addComment function", () => {
    beforeEach(async () => {
      await UsersTableTestHelper.addUser({ id: "user-123" });
      await ThreadsTableTestHelper.createdThread({
        id: "thread-123",
        owner: "user-123",
      });
    });

    it("should persist new comment", async () => {
      // Arrange
      const createdComment = new CreatedComment({ content: "A comment" });

      const fakeIdGenerator = () => "123";
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      await commentRepositoryPostgres.insertComment(
        "user-123",
        "thread-123",
        createdComment
      );

      // Assert
      const comments = await CommentsTableTestHelper.findCommentsById(
        "comment-123"
      );
      expect(comments).toHaveLength(1);
    });

    it("should return added comment correctly", async () => {
      // Arrange
      const createdComment = new CreatedComment({ content: "A comment" });

      const fakeIdGenerator = () => "123";
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      const addedComment = await commentRepositoryPostgres.insertComment(
        "user-123",
        "thread-123",
        createdComment
      );

      // Assert
      expect(addedComment).toStrictEqual(
        new AddedComment({
          id: "comment-123",
          content: "A comment",
          owner: "user-123",
        })
      );
    });
  });

  describe("getCommentsByThreadId function", () => {
    it("should return thread comments correctly", async () => {
      // Arrange
      const userId = "user-123";
      const otherUserId = "user-456";
      const threadId = "thread-123";

      await UsersTableTestHelper.addUser({ id: userId, username: "foobar" });
      await UsersTableTestHelper.addUser({
        id: otherUserId,
        username: "dicoding",
      });
      await ThreadsTableTestHelper.createdThread({
        id: threadId,
        owner: userId,
      });

      await CommentsTableTestHelper.insertComment({
        id: "comment-new",
        content: "A new comment",
        date: "2023-09-10",
        thread: threadId,
        owner: userId,
      });
      await CommentsTableTestHelper.insertComment({
        id: "comment-old",
        content: "An old comment",
        date: "2023-09-09",
        thread: threadId,
        owner: otherUserId,
      });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action
      const comments = await commentRepositoryPostgres.fetchCommentsByThread(
        threadId
      );

      // Assert
      expect(comments).toHaveLength(2);
      expect(comments[0].id).toBe("comment-old"); // older comment first
      expect(comments[1].id).toBe("comment-new");
      expect(comments[0].username).toBe("dicoding");
      expect(comments[1].username).toBe("foobar");
      expect(comments[0].content).toBe("An old comment");
      expect(comments[1].content).toBe("A new comment");
      expect(comments[0].date).toBeTruthy();
      expect(comments[1].date).toBeTruthy();
    });
  });

  describe("removeCommentById function", () => {
    it("should soft delete comment and update is_delete field", async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: "user-123" });
      await ThreadsTableTestHelper.createdThread({
        id: "thread-123",
        owner: "user-123",
      });

      const commentId = "comment-123";
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await CommentsTableTestHelper.insertComment({
        id: commentId,
        thread: "thread-123",
        owner: "user-123",
      });

      // Action
      await commentRepositoryPostgres.removeCommentById(commentId);

      // Assert
      const comments = await CommentsTableTestHelper.findCommentsById(
        commentId
      );
      expect(comments).toHaveLength(1);
      expect(comments[0].is_delete).toBeTruthy();
    });
  });
});
