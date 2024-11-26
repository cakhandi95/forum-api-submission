const AddedThread = require('../AddedThread');

describe("AddedThread Class", () => {
  // Test for successful creation of an AddedThread instance
  it("should create an AddedThread instance with correct data", () => {
    const data = {
      id: "thread-123",
      title: "Thread Title",
      owner: "user-123",
    };

    const addedThread = new AddedThread(data);

    expect(addedThread.id).toBe(data.id);
    expect(addedThread.title).toBe(data.title);
    expect(addedThread.owner).toBe(data.owner);
  });

  // Test for missing required fields
  it("should throw an error when required fields are missing", () => {
    const data = {
      id: "thread-123",
      // Missing 'title'
      owner: "user-123",
    };

    expect(() => new AddedThread(data)).toThrow(
      "ADDED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  // Test for missing multiple required fields
  it("should throw an error when multiple required fields are missing", () => {
    const data = {
      id: "thread-123",
      // Missing 'title' and 'owner'
    };

    expect(() => new AddedThread(data)).toThrow(
      "ADDED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  // Test for invalid data types
  it("should throw an error when data types are invalid", () => {
    const data = {
      id: 123, // should be a string
      title: "Thread Title",
      owner: "user-123",
    };

    expect(() => new AddedThread(data)).toThrow(
      "ADDED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  // Test for invalid data type on the 'owner' property
  it("should throw an error when the owner is not a string", () => {
    const data = {
      id: "thread-123",
      title: "Thread Title",
      owner: 456, // Invalid type
    };

    expect(() => new AddedThread(data)).toThrow(
      "ADDED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });
});
