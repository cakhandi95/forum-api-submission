class CreatedThread {
  constructor(data) {
    this._validateData(data);

    this.title = data.title;
    this.body = data.body;
  }

  _validateData(data) {
    const { title, body } = data;

    console.log("Input to CreatedThread:", { title, body });

    if (!title || !body) {
      throw new Error("CREATED_THREAD.MISSING_REQUIRED_FIELDS");
    }

    if (typeof title !== "string" || typeof body !== "string") {
      throw new Error("CREATED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION");
    }
  }
}

module.exports = CreatedThread;
