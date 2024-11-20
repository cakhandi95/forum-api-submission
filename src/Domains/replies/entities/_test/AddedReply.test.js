const AddedReply = require("../AddedReply");
const { nanoId } = require("nanoid");

describe("AddedReply entities", () => {
  it("should throw error when payload not contain needed property", () => {
    // Arrange
    const payload = {
      content: "A reply",
      owner: "user-123",
    };

    // Action & Assert
    expect(() => new AddedReply(payload)).toThrowError(
      "ADDED_REPLY.MISSING_REQUIRED_FIELDS"
    );
  });

  it("should throw error when payload does not meet data type requirements", () => {
    // Arrange
    const payload = {
      id: `reply-${nanoId}`,
      content: "A reply",
      owner: 123,
    };

    // Action & Assert
    expect(() => new AddedReply(payload)).toThrowError(
      "ADDED_REPLY.INVALID_DATA_TYPE"
    );
  });

  it("should create AddedReply entities correctly", () => {
    // Arrange
    const payload = {
      id: `reply-${nanoId}`,
      content: "A reply message",
      owner: "handy",
    };

    // Action
    const addedReply = new AddedReply(payload);

    // Assert
    expect(addedReply).toBeInstanceOf(AddedReply);
    expect(addedReply.id).toEqual(payload.id);
    expect(addedReply.content).toEqual(payload.content);
    expect(addedReply.owner).toEqual(payload.owner);
  });
});
