const DetailedThread = require('../DetailedThread');

describe('DetailedThread Class', () => {
  // Test for successful creation of a DetailedThread instance
  it('should create a DetailedThread instance with correct data', () => {
    const data = {
      id: 'thread-123',
      title: 'Thread Title',
      body: 'This is the body of the thread.',
      date: '2024-11-26',
      username: 'johndoe',
      comments: [
        { id: 'comment-1', content: 'First comment', username: 'user1' },
        { id: 'comment-2', content: 'Second comment', username: 'user2' },
      ],
    };

    const detailedThread = new DetailedThread(data);

    expect(detailedThread.id).toBe(data.id);
    expect(detailedThread.title).toBe(data.title);
    expect(detailedThread.body).toBe(data.body);
    expect(detailedThread.date).toBe(data.date);
    expect(detailedThread.username).toBe(data.username);
    expect(detailedThread.comments).toEqual(data.comments);
  });

  // Test for missing required fields (missing 'body')
  it('should throw an error when a required field is missing', () => {
    const data = {
      id: 'thread-123',
      title: 'Thread Title',
      // Missing 'body'
      date: '2024-11-26',
      username: 'johndoe',
      comments: [],
    };

    expect(() => new DetailedThread(data)).toThrow(
      'DETAILED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY'
    );
  });

  // Test for missing multiple required fields (missing 'title' and 'date')
  it('should throw an error when multiple required fields are missing', () => {
    const data = {
      id: 'thread-123',
      // Missing 'title'
      body: 'This is the body of the thread.',
      // Missing 'date'
      username: 'johndoe',
      comments: [],
    };

    expect(() => new DetailedThread(data)).toThrow(
      'DETAILED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY'
    );
  });

  // Test for invalid data types (comments should be an array)
  it('should throw an error when comments is not an array', () => {
    const data = {
      id: 'thread-123',
      title: 'Thread Title',
      body: 'This is the body of the thread.',
      date: '2024-11-26',
      username: 'johndoe',
      comments: 'not-an-array', // Invalid type
    };

    expect(() => new DetailedThread(data)).toThrow(
      'DETAILED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION'
    );
  });

  // Test for invalid data type on 'username' property
  it('should throw an error when username is not a string', () => {
    const data = {
      id: 'thread-123',
      title: 'Thread Title',
      body: 'This is the body of the thread.',
      date: '2024-11-26',
      username: 12345, // Invalid type
      comments: [],
    };

    expect(() => new DetailedThread(data)).toThrow(
      'DETAILED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION'
    );
  });
});
