const AddComment = require('../AddComment');

describe('AddComment entities', () => {
  it('should throw error when payload does not contain needed property', () => {
    // Arrange
    const payload = {
      content: 'First comment!',
    };

    // Action & Assert
    expect(() => new AddComment(payload)).toThrowError('ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      content: 12345,
      owner: { id: 'user-123' },
      threadId: 'thread-123',
    };

    // Action & Assert
    expect(() => new AddComment(payload)).toThrowError('ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should Add AddComment entities correctly', () => {
    // Arrange
    const payload = {
      content: 'First comment!',
      owner: 'user-123',
      threadId: 'thread-123',
    };

    // Action
    const addComment = new AddComment(payload);

    // Assert
    expect(addComment).toBeInstanceOf(AddComment);
    expect(addComment.content).toEqual(payload.content);
    expect(addComment.owner).toEqual(payload.owner);
    expect(addComment.threadId).toEqual(payload.threadId);
  });
});
