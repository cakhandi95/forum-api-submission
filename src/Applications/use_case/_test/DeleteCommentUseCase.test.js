const DeleteCommentUseCase = require("../DeleteCommentUseCase");
const CommentRepository = require("../../../Domains/comments/CommentRepository");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");

describe("DeleteCommentUseCase", () => {
  it("should orchestrating the delete comment action correctly", async () => {
    // Arrange
    const useCaseParams = {
      threadId: "thread-123",
      commentId: "comment-123",
    };

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    /** mocking needed function */
    mockThreadRepository.verifyThreadExists = jest.fn(() => Promise.resolve());
    mockCommentRepository.isCommentAvailable = jest.fn(() => Promise.resolve());
    mockCommentRepository.validateCommentOwner = jest.fn(() =>
      Promise.resolve()
    );
    mockCommentRepository.removeCommentById = jest.fn(() => Promise.resolve());

    /** creating use case instance */
    const deleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    await deleteCommentUseCase.execute("user-123", useCaseParams);

    // Assert
    expect(mockThreadRepository.verifyThreadExists).toHaveBeenCalledWith(
      useCaseParams.threadId
    );
    expect(mockCommentRepository.isCommentAvailable).toHaveBeenCalledWith(
      useCaseParams.commentId,
      useCaseParams.threadId
    );
    expect(mockCommentRepository.validateCommentOwner).toHaveBeenCalledWith(
      useCaseParams.commentId,
      "user-123"
    );
    expect(mockCommentRepository.removeCommentById).toHaveBeenCalledWith(
      useCaseParams.commentId
    );
  });
});
