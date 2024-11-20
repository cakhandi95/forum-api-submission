const ReplyRepository = require("../ReplyRepository");

describe("CommentReplyRepository abstract interface", () => {
  it("should throw an error when calling unimplemented methods", async () => {
    // Arrange
    const replyRepository = new ReplyRepository();

    // Action and Assert
    await expect(replyRepository.createReply({}, "")).rejects.toThrowError(
      "REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED"
    );
    await expect(
      replyRepository.fetchRepliesByCommentId("")
    ).rejects.toThrowError("REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED");
    await expect(
      replyRepository.retrieveRepliesByThreadId("")
    ).rejects.toThrowError("REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED");
    await expect(replyRepository.removeReplyById("")).rejects.toThrowError(
      "REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED"
    );
    await expect(replyRepository.isReplyAvailable("", "")).rejects.toThrowError(
      "REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED"
    );
    await expect(
      replyRepository.confirmReplyOwnership("", "")
    ).rejects.toThrowError("REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  });
});
