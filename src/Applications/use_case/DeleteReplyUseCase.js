class DeleteReplyUseCase {
  constructor({ replyRepository, commentRepository, threadRepository }) {
    this._replyRepository = replyRepository;
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(userId, useCaseParams) {
    const { threadId, commentId, replyId } = useCaseParams;
    await this._threadRepository.verifyThreadExists(threadId);
    await this._commentRepository.isCommentAvailable(commentId, threadId);
    await this._replyRepository.isReplyAvailable(replyId, commentId);
    await this._replyRepository.confirmReplyOwnership(replyId, userId);

    return this._replyRepository.removeReplyById(replyId);
  }
}

module.exports = DeleteReplyUseCase;
