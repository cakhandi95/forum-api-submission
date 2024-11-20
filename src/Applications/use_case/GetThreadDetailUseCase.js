const DetailedComment = require("../../Domains/comments/entities/DetailedComment");
const DetailedReply = require("../../Domains/replies/entities/DetailedReply");
const DetailedThread = require("../../Domains/threads/entities/DetailedThread");

class GetThreadDetailUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(threadId) {
    const threadDetail = await this._threadRepository.fetchThreadById(threadId);
    const threadComments = await this._commentRepository.fetchCommentsByThread(
      threadId
    );
    const threadCommentsReplies =
      await this._replyRepository.retrieveRepliesByThreadId(threadId);

    threadDetail.comments = threadComments.map(
      (comment) =>
        new DetailedComment({
          ...comment,
          replies: comment.is_delete
            ? []
            : threadCommentsReplies
                .filter((reply) => reply.comment === comment.id)
                .map((reply) => new DetailedReply(reply)),
        })
    );

    return new DetailedThread(threadDetail);
  }
}

module.exports = GetThreadDetailUseCase;
