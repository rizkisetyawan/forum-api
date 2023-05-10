const AddedCommentThread = require('../AddedCommentThread');

describe('a AddedCommentThread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      content: 'Dicoding Indonesia',
    };

    // Action and Assert
    expect(() => new AddedCommentThread(payload)).toThrowError(
      'ADDED_COMMENT_THREAD.NOT_CONTAIN_NEEDED_PROPERTY'
    );
  });

  it('should create addCommentThread object correctly', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      content: 'Dicoding Indonesia',
      owner: 'user-123',
    };

    // Action
    const { id, content, owner } = new AddedCommentThread(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(content).toEqual(payload.content);
    expect(owner).toEqual(payload.owner);
  });
});
