class DetailedThread {
  constructor(data) {
    this._validateData(data);

    const { id, title, body, date, username, comments } = data;

    this.id = id;
    this.title = title;
    this.body = body;
    this.date = date;
    this.username = username;
    this.comments = comments;
  }

  _validateData(data) {
    const { id, title, body, date, username, comments } = data;

    ///console.log(`_validateData: `, data);

    if (!id || !title || !body || !date || !username || !comments) {
      throw new Error("DETAILED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY");
    }

    if (
      typeof id !== "string" ||
      typeof title !== "string" ||
      typeof body !== "string" ||
      typeof date !== "string" ||
      typeof username !== "string" ||
      !Array.isArray(comments)
    ) {
      throw new Error("DETAILED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION");
    }
  }
}

module.exports = DetailedThread;
