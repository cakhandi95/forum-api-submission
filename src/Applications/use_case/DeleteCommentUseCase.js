class DeleteCommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(userId, useCaseParams) {
    const { threadId, commentId } = useCaseParams;
    await this._threadRepository.verifyThreadExists(threadId);
    await this._commentRepository.isCommentAvailable(commentId, threadId);
    await this._commentRepository.validateCommentOwner(commentId, userId);

    return this._commentRepository.removeCommentById(commentId);
  }
}

module.exports = DeleteCommentUseCase;
