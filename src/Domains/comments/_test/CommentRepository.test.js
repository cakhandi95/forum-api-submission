const CommentRepository = require("../CommentRepository");

describe("CommentRepository interface", () => {
  it("should throw error when invoke abstract behavior", async () => {
    // Arrange
    const commentRepository = new CommentRepository();

    // Action and Assert
    await expect(commentRepository.insertComment({})).rejects.toThrowError(
      "COMMENT_REPOSITORY.UNIMPLEMENTED_METHOD"
    );
    await expect(
      commentRepository.fetchCommentsByThread("")
    ).rejects.toThrowError("COMMENT_REPOSITORY.UNIMPLEMENTED_METHOD");
    await expect(commentRepository.removeCommentById("")).rejects.toThrowError(
      "COMMENT_REPOSITORY.UNIMPLEMENTED_METHOD"
    );
    await expect(
      commentRepository.removeCommentById("", "")
    ).rejects.toThrowError("COMMENT_REPOSITORY.UNIMPLEMENTED_METHOD");
    await expect(
      commentRepository.isCommentAvailable("", "")
    ).rejects.toThrowError("COMMENT_REPOSITORY.UNIMPLEMENTED_METHOD");
  });
});
