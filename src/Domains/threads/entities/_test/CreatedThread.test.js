const CreatedThread = require('../CreatedThread');

describe('CreatedThread Class', () => {
  // Test for successful creation of a CreatedThread instance
  it('should create a CreatedThread instance with correct data', () => {
    const data = {
      title: 'Thread Title',
      body: 'This is the body of the thread.',
    };

    const createdThread = new CreatedThread(data);

    expect(createdThread.title).toBe(data.title);
    expect(createdThread.body).toBe(data.body);
  });

  // Test for missing required fields (missing title)
  it('should throw an error when title is missing', () => {
    const data = {
      // Missing 'title'
      body: 'This is the body of the thread.',
    };

    expect(() => new CreatedThread(data)).toThrow(
      'CREATED_THREAD.MISSING_REQUIRED_FIELDS'
    );
  });

  // Test for missing required fields (missing body)
  it('should throw an error when body is missing', () => {
    const data = {
      title: 'Thread Title',
      // Missing 'body'
    };

    expect(() => new CreatedThread(data)).toThrow(
      'CREATED_THREAD.MISSING_REQUIRED_FIELDS'
    );
  });

  // Test for invalid data types (title is not a string)
  it('should throw an error when title is not a string', () => {
    const data = {
      title: 123, // Invalid type
      body: 'This is the body of the thread.',
    };

    expect(() => new CreatedThread(data)).toThrow(
      'CREATED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION'
    );
  });

  // Test for invalid data types (body is not a string)
  it('should throw an error when body is not a string', () => {
    const data = {
      title: 'Thread Title',
      body: 456, // Invalid type
    };

    expect(() => new CreatedThread(data)).toThrow(
      'CREATED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION'
    );
  });
});
