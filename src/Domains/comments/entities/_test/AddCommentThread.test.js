const AddCommentThread = require('../AddCommentThread');

describe('a AddCommentThread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      threadId: 'thread-123',
      content: 'Dicoding Indonesia',
    };

    // Action and Assert
    expect(() => new AddCommentThread(payload)).toThrowError(
      'ADD_COMMENT_THREAD.NOT_CONTAIN_NEEDED_PROPERTY'
    );
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      threadId: 'thread-123',
      content: 123,
      owner: 'user-123',
    };

    // Action and Assert
    expect(() => new AddCommentThread(payload)).toThrowError(
      'ADD_COMMENT_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION'
    );
  });

  it('should create addCommentThread object correctly', () => {
    // Arrange
    const payload = {
      threadId: 'thread-123',
      content: 'Dicoding Indonesia',
      owner: 'user-123',
    };

    // Action
    const { threadId, content, owner } = new AddCommentThread(payload);

    // Assert
    expect(threadId).toEqual(payload.threadId);
    expect(content).toEqual(payload.content);
    expect(owner).toEqual(payload.owner);
  });
});
