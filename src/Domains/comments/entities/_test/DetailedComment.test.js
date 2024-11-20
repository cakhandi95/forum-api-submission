const DetailedComment = require("../DetailedComment");

describe("DetailedComment entity tests", () => {
  it("should throw an error when data is missing required fields", () => {
    // Setup
    const data = {
      id: "comment-1",
      username: "user123",
      content: "This is a comment",
      // missing fields like date, replies, and likeCount
    };

    // Action & Verification
    expect(() => new DetailedComment(data)).toThrowError(
      "DETAILED_COMMENT.MISSING_REQUIRED_FIELDS"
    );
  });

  it("should throw an error when data has invalid types", () => {
    // Setup
    const data = {
      id: 123, // should be a string
      username: "user123",
      content: "This is a comment",
      date: "2024-11-14",
      replies: "not an array", // should be an array
      is_delete: false,
    };

    // Action & Verification
    expect(() => new DetailedComment(data)).toThrowError(
      "DETAILED_COMMENT.INVALID_DATA_TYPE"
    );
  });

  it("should create a DetailedComment instance correctly with valid data", () => {
    // Setup
    const data = {
      id: "comment-1",
      username: "CakHandi95",
      content: "This is a comment",
      date: "2024-11-14",
      replies: [],
      likeCount: 10,
      is_delete: false,
    };

    // Action
    const detailedComment = new DetailedComment(data);

    // Verification
    expect(detailedComment).toBeInstanceOf(DetailedComment);
    expect(detailedComment.id).toBe(data.id);
    expect(detailedComment.username).toBe(data.username);
    expect(detailedComment.content).toBe(data.content);
    expect(detailedComment.date).toBe(data.date);
    expect(detailedComment.replies).toEqual(data.replies);
  });

  it('should replace content with "**comment deleted**" if is_delete is true', () => {
    // Setup
    const data = {
      id: "comment-1",
      username: "user123",
      content: "This is a comment",
      date: "2024-11-14",
      replies: [],
      likeCount: 10,
      is_delete: true,
    };

    // Action
    const detailedComment = new DetailedComment(data);

    // Verification
    expect(detailedComment.content).toBe("**comment deleted**");
  });
});
