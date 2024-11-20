class CreatedReply {
  constructor(data) {
    this._validateData(data);

    this.content = data.content;
  }

  _validateData(data) {
    const { content } = data;

    if (!content) {
      throw new Error("CREATED_REPLY.MISSING_REQUIRED_FIELD");
    }

    if (typeof content !== "string") {
      throw new Error("CREATED_REPLY.INVALID_DATA_TYPE");
    }
  }
}

module.exports = CreatedReply;
