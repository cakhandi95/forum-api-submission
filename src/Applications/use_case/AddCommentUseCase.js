const CreatedComment = require("../../Domains/comments/entities/CreatedComment");

class AddCommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(userId, threadId, useCasePayload) {
    await this._threadRepository.verifyThreadExists(threadId);
    const createdComment = new CreatedComment(useCasePayload);
    return this._commentRepository.addComment(userId, threadId, createdComment);
  }
}

module.exports = AddCommentUseCase;
