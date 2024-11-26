const DeleteReplyUseCase = require("../DeleteReplyUseCase");
const ReplyRepository = require("../../../Domains/replies/ReplyRepository");
const CommentRepository = require("../../../Domains/comments/CommentRepository");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");

describe("DeleteReplyUseCase", () => {
  it("should orchestrating the delete comment action correctly", async () => {
    // Arrange
    const useCaseParams = {
      threadId: "thread-123",
      commentId: "comment-123",
      replyId: "reply-123",
    };

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    /** mocking needed function */
    mockThreadRepository.verifyThreadExists = jest.fn(() => Promise.resolve());
    mockCommentRepository.isCommentAvailable = jest.fn(() => Promise.resolve());
    mockReplyRepository.isReplyAvailable = jest.fn(() => Promise.resolve());
    mockReplyRepository.confirmReplyOwnership = jest.fn(() =>
      Promise.resolve()
    );
    mockReplyRepository.removeReplyById = jest.fn(() => Promise.resolve());

    /** creating use case instance */
    const deleteReplyUseCase = new DeleteReplyUseCase({
      replyRepository: mockReplyRepository,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    await deleteReplyUseCase.execute("user-123", useCaseParams);

    // Assert
    expect(mockThreadRepository.verifyThreadExists).toHaveBeenCalledWith(
      useCaseParams.threadId
    );
    expect(mockCommentRepository.isCommentAvailable).toHaveBeenCalledWith(
      useCaseParams.commentId,
      useCaseParams.threadId
    );
    expect(mockReplyRepository.isReplyAvailable).toHaveBeenCalledWith(
      useCaseParams.replyId,
      useCaseParams.commentId
    );
    expect(mockReplyRepository.confirmReplyOwnership).toHaveBeenCalledWith(
      useCaseParams.replyId,
      "user-123"
    );
    expect(mockReplyRepository.removeReplyById).toHaveBeenCalledWith(
      useCaseParams.replyId
    );
  });
});
