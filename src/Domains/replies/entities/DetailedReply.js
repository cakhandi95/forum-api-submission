class DetailedReply {
  constructor(data) {
    this._validateData(data);

    const { id, username, content, date, isDeleted } = data;

    this.id = id;
    this.username = username;
    this.content = isDeleted ? "**reply has been removed**" : content;
    this.date = date;
  }

  _validateData(data) {
    const { id, username, content, date } = data;

    if (!id || !username || !content || !date) {
      throw new Error("DETAILED_REPLY.MISSING_REQUIRED_FIELDS");
    }

    if (
      typeof id !== "string" ||
      typeof username !== "string" ||
      typeof content !== "string" ||
      (typeof date !== "string" && typeof date !== "object")
    ) {
      throw new Error("DETAILED_REPLY.INVALID_DATA_TYPE");
    }
  }
}

module.exports = DetailedReply;
