const GetThreadDetailUseCase = require("../GetThreadDetailUseCase");
const DetailedThread = require("../../../Domains/threads/entities/DetailedThread");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const CommentRepository = require("../../../Domains/comments/CommentRepository");
const ReplyRepository = require("../../../Domains/replies/ReplyRepository");
const DetailedComment = require("../../../Domains/comments/entities/DetailedComment");
const DetailedReply = require("../../../Domains/replies/entities/DetailedReply");

describe("GetThreadDetailUseCase", () => {
  it("should orchestrating the get thread detail action correctly", async () => {
    // Arrange
    const mockThreadDetail = {
      id: "thread-123",
      title: "A thread",
      body: "A long thread",
      date: "2023-09-07T00:00:00.000Z",
      username: "foobar",
    };

    const mockComments = [
      {
        id: "comment-1",
        username: "dicoding",
        date: "2023-09-07T00:00:00.000Z",
        content: "a comment",
        is_delete: false,
      },
      {
        id: "comment-2",
        username: "foobar",
        date: "2023-09-08T00:00:00.000Z",
        content: "a deleted comment",
        is_delete: true,
      },
    ];

    const mockReplies = [
      {
        id: "reply-1",
        content: "a reply",
        date: "2023-09-08T00:00:00.000Z",
        comment: "comment-1",
        owner: "dicoding",
        is_delete: false,
        username: "dicoding",
      },
      {
        id: "reply-2",
        content: "a deleted reply",
        date: "2023-09-09T00:00:00.000Z",
        comment: "comment-1",
        owner: "foobar",
        is_delete: true,
        username: "foobar",
      },
      {
        id: "reply-3",
        content: "a reply",
        date: "2023-09-09T00:00:00.000Z",
        comment: "comment-2",
        owner: "foobar",
        is_delete: false,
        username: "foobar",
      },
    ];

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    /** mocking needed function */
    mockThreadRepository.fetchThreadById = jest.fn(() =>
      Promise.resolve(mockThreadDetail)
    );
    mockCommentRepository.fetchCommentsByThread = jest.fn(() =>
      Promise.resolve(mockComments)
    );
    mockReplyRepository.retrieveRepliesByThreadId = jest.fn(() =>
      Promise.resolve(mockReplies)
    );

    /** creating use case instance */
    const getThreadDetailUseCase = new GetThreadDetailUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    // Action
    const threadDetail = await getThreadDetailUseCase.execute("thread-123");

    // Assert
    expect(threadDetail).toStrictEqual(
      new DetailedThread({
        id: "thread-123",
        title: "A thread",
        body: "A long thread",
        date: "2023-09-07T00:00:00.000Z",
        username: "foobar",
        comments: [
          new DetailedComment({
            id: "comment-1",
            username: "dicoding",
            date: "2023-09-07T00:00:00.000Z",
            content: "a comment",
            replies: [
              new DetailedReply({
                id: "reply-1",
                username: "dicoding",
                content: "a reply",
                date: "2023-09-08T00:00:00.000Z",
              }),
              new DetailedReply({
                id: "reply-2",
                username: "foobar",
                date: "2023-09-09T00:00:00.000Z",
                content: "a deleted reply",
              }),
            ],
            likeCount: 2,
          }),
          new DetailedComment({
            id: "comment-2",
            username: "foobar",
            date: "2023-09-08T00:00:00.000Z",
            content: "**komentar telah dihapus**",
            replies: [],
            likeCount: 3,
          }),
        ],
      })
    );
    expect(mockThreadRepository.fetchThreadById).toBeCalledWith("thread-123");
    expect(mockCommentRepository.fetchCommentsByThread).toBeCalledWith(
      "thread-123"
    );
    expect(mockReplyRepository.retrieveRepliesByThreadId).toBeCalledTimes(1);
    expect(mockReplyRepository.retrieveRepliesByThreadId).toBeCalledWith(
      "thread-123"
    );
  });
});
