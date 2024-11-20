const CreatedReply = require("../CreatedReply");

describe("CreatedReply entities", () => {
  it("should throw an error if required fields are missing", () => {
    // Arrange
    const data = {};

    // Action & Assert
    expect(() => new CreatedReply(data)).toThrowError(
      "CREATED_REPLY.MISSING_REQUIRED_FIELD"
    );
  });

  it("should throw an error if the content is not a string", () => {
    // Arrange
    const data = { content: 123 };

    // Action & Assert
    expect(() => new CreatedReply(data)).toThrowError(
      "CREATED_REPLY.INVALID_DATA_TYPE"
    );
  });

  it("should correctly create an instance of CreatedReply", () => {
    // Arrange
    const data = { content: "a sample reply" };

    // Action
    const createdReply = new CreatedReply(data);

    // Assert
    expect(createdReply).toBeInstanceOf(CreatedReply);
    expect(createdReply.content).toEqual(data.content);
  });
});
