const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const GetThreadUseCase = require('../GetThreadUseCase');

describe('GetThreadUseCase', () => {
  /**
   * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
   */
  it('should orchestrating the get thread action correctly', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
    };

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockThreadRepository.getThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockThreadRepository.getComments = jest.fn().mockImplementation(() =>
      Promise
        .resolve
        // {
        // id: 'thread-123',
        // comments: [
        //   {
        //     id: 'comment-1',
        //     username: 'johndoe',
        //     date: '2023-05-09T04:12:25.987Z',
        //     content: 'sebuah comment',
        //     is_delete: true,
        //   },
        //   {
        //     id: 'comment-2',
        //     username: 'dicoding',
        //     date: '2023-05-09T04:12:26.003Z',
        //     content: 'sebuah comment',
        //     is_delete: false,
        //   },
        // ],
        // }
        ()
    );

    /** creating use case instance */
    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action
    await getThreadUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.getThread).toBeCalledWith(
      useCasePayload.threadId
    );
    expect(mockThreadRepository.getComments).toBeCalledWith(
      useCasePayload.threadId
    );
  });
});
