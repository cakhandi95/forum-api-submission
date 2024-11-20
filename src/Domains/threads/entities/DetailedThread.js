class ThreadDetail {
  constructor(data) {
    this._validateData(data);

    const { id, title, content, createdAt, author, replies } = data;

    this.id = id;
    this.title = title;
    this.content = content;
    this.createdAt = createdAt;
    this.author = author;
    this.replies = replies;
  }

  _validateData(data) {
    const { id, title, content, createdAt, author, replies } = data;

    if (!id || !title || !content || !createdAt || !author || !replies) {
      throw new Error("THREAD_INFORMATION.MISSING_REQUIRED_PROPERTIES");
    }

    if (
      typeof id !== "string" ||
      typeof title !== "string" ||
      typeof content !== "string" ||
      typeof createdAt !== "string" ||
      typeof author !== "string" ||
      !Array.isArray(replies)
    ) {
      throw new Error("THREAD_INFORMATION.INVALID_DATA_TYPE");
    }
  }
}

module.exports = ThreadDetail;
