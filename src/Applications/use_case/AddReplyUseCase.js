const CreatedReply = require("../../Domains/replies/entities/CreatedReply");

class AddReplyUseCase {
  constructor({ replyRepository, commentRepository, threadRepository }) {
    this._replyRepository = replyRepository;
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(userId, useCaseParams, useCasePayload) {
    const { threadId, commentId } = useCaseParams;
    await this._threadRepository.verifyThreadExists(threadId);
    await this._commentRepository.isCommentAvailable(commentId, threadId);

    const createReply = new CreatedReply(useCasePayload);
    return this._replyRepository.createReply(userId, commentId, createReply);
  }
}

module.exports = AddReplyUseCase;
