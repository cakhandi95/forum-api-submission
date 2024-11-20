const CreatedComment = require("../CreatedComment");

describe("CreatedComment entity tests", () => {
  it("should throw an error if content is missing", () => {
    // Setup
    const data = {};

    // Action & Verification
    expect(() => new CreatedComment(data)).toThrowError(
      "CREATED_COMMENT.MISSING_REQUIRED_PROPERTY"
    );
  });

  it("should throw an error if content is not a string", () => {
    // Setup
    const data = { content: 123 };

    // Action & Verification
    expect(() => new CreatedComment(data)).toThrowError(
      "CREATED_COMMENT.INVALID_DATA_TYPE"
    );
  });

  it("should create an instance of CreatedComment correctly with valid content", () => {
    // Setup
    const data = { content: "This is a valid comment" };

    // Action
    const createdComment = new CreatedComment(data);

    // Verification
    expect(createdComment).toBeInstanceOf(CreatedComment);
    expect(createdComment.content).toBe(data.content);
  });
});
