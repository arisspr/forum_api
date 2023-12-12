const AddThread = require('../AddThread');

describe('CreateThread entities', () => {
  it('should throw error when payload does not contain needed property', () => {
    // Arrange
    const payload = {
      title: 'ini sebuah Title Thread',
    };

    // Action & Assert
    expect(() => new AddThread(payload)).toThrowError('ADD_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      title: true,
      body: 12345,
      owner: { id: 'user-123' },
    };

    // Action & Assert
    expect(() => new AddThread(payload)).toThrowError('ADD_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create CreateThread entities correctly', () => {
    // Arrange
    const payload = {
      title: 'ini sebuah Title Thread',
      body: 'Thread body',
      owner: 'user-123',
    };

    // Action
    const addThread = new AddThread(payload);

    // Assert
    expect(addThread).toBeInstanceOf(AddThread);
    expect(addThread.title).toEqual(payload.title);
    expect(addThread.body).toEqual(payload.body);
    expect(addThread.owner).toEqual(payload.owner);
  });
});
