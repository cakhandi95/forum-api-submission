class AddedThread {
  constructor(data) {
    this._validateData(data);

    const { id, title, owner } = data;

    this.id = id;
    this.title = title;
    this.owner = owner;
  }

  _validateData(data) {
    const { id, title, owner } = data;

    if (!id || !title || !owner) {
      throw new Error("ADDED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY");
    }

    if (
      typeof id !== "string" ||
      typeof title !== "string" ||
      typeof owner !== "string"
    ) {
      throw new Error("ADDED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION");
    }
  }
}

module.exports = AddedThread;
