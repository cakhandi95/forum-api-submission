const AddReplyUseCase = require("../AddReplyUseCase");
const CreatedReply = require("../../../Domains/replies/entities/CreatedReply");
const AddedReply = require("../../../Domains/replies/entities/AddedReply");
const ReplyRepository = require("../../../Domains/replies/ReplyRepository");
const CommentRepository = require("../../../Domains/comments/CommentRepository");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");

describe("AddReplyUseCase", () => {
  it("should orchestrating the add reply action correctly", async () => {
    // Arrange
    const useCaseParams = {
      threadId: "thread-123",
      commentId: "comment-123",
    };
    const useCasePayload = { content: "A reply" };

    const mockAddedReply = new AddedReply({
      id: "reply-123",
      content: useCasePayload.content,
      owner: "user-123",
    });

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    /** mocking needed function */
    mockThreadRepository.verifyThreadExists = jest.fn(() => Promise.resolve());
    mockCommentRepository.isCommentAvailable = jest.fn(() => Promise.resolve());
    mockReplyRepository.createReply = jest.fn(() =>
      Promise.resolve(mockAddedReply)
    );

    /** creating use case instance */
    const addReplyUseCase = new AddReplyUseCase({
      replyRepository: mockReplyRepository,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    const addedReply = await addReplyUseCase.execute(
      "user-123",
      useCaseParams,
      useCasePayload
    );

    // Assert
    expect(addedReply).toStrictEqual(
      new AddedReply({
        id: "reply-123",
        content: "A reply",
        owner: "user-123",
      })
    );

    expect(mockThreadRepository.verifyThreadExists).toBeCalledWith(
      useCaseParams.threadId
    );
    expect(mockCommentRepository.isCommentAvailable).toBeCalledWith(
      useCaseParams.commentId,
      useCaseParams.threadId
    );
    expect(mockReplyRepository.createReply).toBeCalledWith(
      "user-123",
      useCaseParams.commentId,
      new CreatedReply({ content: useCasePayload.content })
    );
  });
});
