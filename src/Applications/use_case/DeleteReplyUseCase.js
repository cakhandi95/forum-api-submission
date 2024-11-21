class DeleteReplyUseCase {
  constructor({ replyRepository, commentRepository, threadRepository }) {
    this._replyRepository = replyRepository;
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(userId, useCaseParams) {
    const { threadId, commentId, replyId } = useCaseParams;
    await this._threadRepository.verifyThreadExists(threadId);
    //////console.log("STEP1");
    await this._commentRepository.isCommentAvailable(commentId, threadId);
    ///console.log("STEP2");
    await this._replyRepository.isReplyAvailable(replyId, commentId);
    ///console.log("STEP3");
    await this._replyRepository.confirmReplyOwnership(replyId, userId);
    ///console.log("STEP4");

    return this._replyRepository.removeReplyById(replyId);
  }
}

module.exports = DeleteReplyUseCase;
