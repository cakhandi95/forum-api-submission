const AddedComment = require("../AddedComment");
const { nanoid } = require("nanoid");

describe("AddedComment entity tests", () => {
  it("should throw an error when the data is missing required properties", () => {
    // Setup
    const data = {};

    // Action & Verification
    expect(() => new AddedComment(data)).toThrowError(
      "ADDED_COMMENT.MISSING_REQUIRED_PROPERTIES"
    );
  });

  it("should throw an error if any property has an invalid data type", () => {
    // Setup
    const data = { id: nanoid, content: "A valid comment", owner: true };

    // Action & Verification
    expect(() => new AddedComment(data)).toThrowError(
      "ADDED_COMMENT.INVALID_PROPERTY_TYPES"
    );
  });

  it("should create an instance of AddedComment correctly with valid input", () => {
    // Setup
    const data = {
      id: nanoid.toString(),
      content: "This is a test comment",
      owner: "Handika",
    };

    // Action
    const addedComment = new AddedComment(data);

    // Verification
    expect(addedComment).toBeInstanceOf(AddedComment);
    expect(addedComment.id).toBe(data.id);
    expect(addedComment.content).toBe(data.content);
    expect(addedComment.owner).toBe(data.owner);
  });
});
