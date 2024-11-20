class AddedComment {
  constructor(data) {
    this._validateData(data);

    const { id, content, owner } = data;

    this.id = id;
    this.content = content;
    this.owner = owner;
  }

  _validateData(data) {
    const { id, content, owner } = data;

    if (!id || !content || !owner) {
      throw new Error("ADDED_COMMENT.MISSING_REQUIRED_PROPERTIES");
    }

    if (
      typeof id !== "string" ||
      typeof content !== "string" ||
      typeof owner !== "string"
    ) {
      throw new Error("ADDED_COMMENT.INVALID_PROPERTY_TYPES");
    }
  }
}

module.exports = AddedComment;
