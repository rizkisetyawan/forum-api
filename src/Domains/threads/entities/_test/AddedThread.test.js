const AddedThread = require('../AddedThread');

describe('a AddedThread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'dicoding',
      title: 'Dicoding Indonesia',
    };

    // Action and Assert
    expect(() => new AddedThread(payload)).toThrowError(
      'REGISTERED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY'
    );
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 123,
      title: 'dicoding',
      owner: {},
    };

    // Action and Assert
    expect(() => new AddedThread(payload)).toThrowError(
      'REGISTERED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION'
    );
  });

  it('should create registeredUser object correctly', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'dicoding',
      owner: 'Dicoding Indonesia',
    };

    // Action
    const registeredUser = new AddedThread(payload);

    // Assert
    expect(registeredUser.id).toEqual(payload.id);
    expect(registeredUser.title).toEqual(payload.title);
    expect(registeredUser.owner).toEqual(payload.owner);
  });
});
