class CreatedComment {
  constructor(data) {
    this._validateData(data);

    this.content = data.content;
  }

  _validateData(data) {
    const { content } = data;

    if (!content) {
      throw new Error("CREATED_COMMENT.MISSING_REQUIRED_PROPERTY");
    }

    if (typeof content !== "string") {
      throw new Error("CREATED_COMMENT.INVALID_DATA_TYPE");
    }
  }
}

module.exports = CreatedComment;
