class AddedReply {
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
      throw new Error("ADDED_REPLY.MISSING_REQUIRED_FIELDS");
    }

    if (
      typeof id !== "string" ||
      typeof content !== "string" ||
      typeof owner !== "string"
    ) {
      throw new Error("ADDED_REPLY.INVALID_DATA_TYPE");
    }
  }
}
module.exports = AddedReply;
