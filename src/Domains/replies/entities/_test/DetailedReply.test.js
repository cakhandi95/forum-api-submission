const DetailedReply = require("../DetailedReply");
const { nanoId } = require("nanoid");

describe("DetailedReply entities", () => {
  it("should throw an error if required properties are missing", () => {
    // Arrange
    const data = {
      id: `reply-${nanoId}`,
      username: "foobar",
    };

    // Action & Assert
    expect(() => new DetailedReply(data)).toThrowError(
      "DETAILED_REPLY.MISSING_REQUIRED_FIELDS"
    );
  });

  it("should throw an error if the data type is incorrect", () => {
    // Arrange
    const data = {
      id: `reply-${nanoId}`,
      username: "foobar",
      content: "a sample reply",
      date: 321,
    };

    // Action & Assert
    expect(() => new DetailedReply(data)).toThrowError(
      "DETAILED_REPLY.INVALID_DATA_TYPE"
    );
  });

  it("should correctly create an instance of DetailedReply", () => {
    // Arrange
    const data = {
      id: `reply-${nanoId}`,
      username: "foobar",
      content: "a sample reply",
      date: "2023-09-22T07:19:09.775Z",
    };

    // Action
    const detailedReply = new DetailedReply(data);

    // Assert
    expect(detailedReply).toBeInstanceOf(DetailedReply);
    expect(detailedReply.id).toEqual(data.id);
    expect(detailedReply.username).toEqual(data.username);
    expect(detailedReply.content).toEqual(data.content);
    expect(detailedReply.date).toEqual(data.date);
  });

  it("should create deleted DetailedReply entities correctly", () => {
    // Arrange
    const data = {
      id: "reply-123",
      username: "foobar",
      content: "a reply",
      date: "2023-09-22T07:19:09.775Z",
      is_deleted: true,
    };

    // Action
    const detailedReply = new DetailedReply(data);

    // Assert
    expect(detailedReply).toBeInstanceOf(DetailedReply);
    expect(detailedReply.id).toEqual(data.id);
    expect(detailedReply.username).toEqual(data.username);
    expect(detailedReply.content).toEqual("a reply");
    expect(detailedReply.date).toEqual(data.date);
  });
});
