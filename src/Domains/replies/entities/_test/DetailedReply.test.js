const DetailedReply = require('../DetailedReply');

describe('DetailedReply', () => {
  it('should create an instance correctly when all required fields are provided', () => {
    // Arrange
    const data = {
      id: 'reply-123',
      username: 'user1',
      content: 'This is a reply',
      date: '2023-10-10',
      isDeleted: false,
    };

    // Act
    const detailedReply = new DetailedReply(data);

    // Assert
    expect(detailedReply.id).toBe(data.id);
    expect(detailedReply.username).toBe(data.username);
    expect(detailedReply.content).toBe(data.content);
    expect(detailedReply.date).toBe(data.date);
  });

  it('should replace content with "**balasan telah dihapus**" if isDeleted is true', () => {
    // Arrange
    const data = {
      id: 'reply-123',
      username: 'user1',
      content: 'This is a reply',
      date: '2023-10-10',
      isDeleted: true,
    };

    // Act
    const detailedReply = new DetailedReply(data);

    // Assert
    expect(detailedReply.content).toBe("**balasan telah dihapus**");
  });

  it('should throw error when required fields are missing', () => {
    // Arrange
    const data = {
      id: 'reply-123',
      username: 'user1',
      // Missing 'content' and 'date'
    };

    // Act & Assert
    expect(() => new DetailedReply(data)).toThrow("DETAILED_REPLY.MISSING_REQUIRED_FIELDS");
  });

  it('should throw error when fields are of invalid data types', () => {
    // Arrange
    const data = {
      id: 123,  // invalid type, should be string
      username: 'user1',
      content: 'This is a reply',
      date: '2023-10-10',
    };

    // Act & Assert
    expect(() => new DetailedReply(data)).toThrow("DETAILED_REPLY.INVALID_DATA_TYPE");
  });

  it('should throw error when date is not a string or Date object', () => {
    // Arrange
    const data = {
      id: 'reply-123',
      username: 'user1',
      content: 'This is a reply',
      date: 12345, // invalid type, should be string or Date
    };

    // Act & Assert
    expect(() => new DetailedReply(data)).toThrow("DETAILED_REPLY.INVALID_DATA_TYPE");
  });
});