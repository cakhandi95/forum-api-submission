/* eslint-disable camelcase */
class DetailedComment {
  constructor(data) {
    this._validateData(data);

    const { id, username, content, date, replies, is_delete } = data;

    this.id = id;
    this.username = username;
    this.content = is_delete ? "**komentar telah dihapus**" : content;
    this.date = date;
    this.replies = replies;
  }

  _validateData(data) {
    const { id, username, content, date, replies } = data;

    if (!id || !username || !content || !date) {
      throw new Error("DETAILED_COMMENT.MISSING_REQUIRED_FIELDS");
    }

    if (
      typeof id !== "string" ||
      typeof username !== "string" ||
      typeof content !== "string" ||
      typeof date !== "string" ||
      !Array.isArray(replies)
    ) {
      throw new Error("DETAILED_COMMENT.INVALID_DATA_TYPE");
    }
  }
}

module.exports = DetailedComment;
