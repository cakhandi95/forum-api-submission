/* eslint-disable no-unused-vars */
class CommentRepository {
  async insertComment(userId, threadId, commentData) {
    throw new Error("COMMENT_REPOSITORY.UNIMPLEMENTED_METHOD");
  }

  async fetchCommentsByThread(threadId) {
    throw new Error("COMMENT_REPOSITORY.UNIMPLEMENTED_METHOD");
  }

  async removeCommentById(commentId) {
    throw new Error("COMMENT_REPOSITORY.UNIMPLEMENTED_METHOD");
  }

  async isCommentAvailable(commentId, threadId) {
    throw new Error("COMMENT_REPOSITORY.UNIMPLEMENTED_METHOD");
  }

  async validateCommentOwner(commentId, userId) {
    throw new Error("COMMENT_REPOSITORY.UNIMPLEMENTED_METHOD");
  }
}

module.exports = CommentRepository;
