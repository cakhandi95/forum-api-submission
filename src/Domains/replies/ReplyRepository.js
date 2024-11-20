/* eslint-disable no-unused-vars */
class ReplyRepository {
  async createReply(userId, commentId, replyData) {
    throw new Error("COMMENT_REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }

  async fetchRepliesByCommentId(commentId) {
    throw new Error("COMMENT_REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }

  async retrieveRepliesByThreadId(threadId) {
    throw new Error("COMMENT_REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }

  async removeReplyById(replyId) {
    throw new Error("COMMENT_REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }

  async isReplyAvailable(replyId, commentId) {
    throw new Error("COMMENT_REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }

  async confirmReplyOwnership(replyId, userId) {
    throw new Error("COMMENT_REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }
}

module.exports = ReplyRepository;
