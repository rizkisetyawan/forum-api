// const AddCommentThread = require('../../../Domains/threads/entities/AddCommentThread');
// const AddedCommentThread = require('../../../Domains/threads/entities/AddedCommentThread');
const AddCommentThread = require('../../../Domains/comments/entities/AddCommentThread');
const AddedCommentThread = require('../../../Domains/comments/entities/AddedCommentThread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const AddCommentThreadUseCase = require('../AddCommentThreadUseCase');

describe('AddCommentThreadUseCase', () => {
  /**
   * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
   */
  it('should orchestrating the add comment thread action correctly', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
      content: 'dicoding indonesia',
      owner: 'user-1',
    };

    const mockAddedThread = new AddedCommentThread({
      id: 'comment-123',
      content: useCasePayload.content,
      owner: useCasePayload.owner,
    });

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    /** mocking needed function */
    mockThreadRepository.verifyAvailableThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.addComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockAddedThread));

    /** creating use case instance */
    const getThreadUseCase = new AddCommentThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    const registeredCommentThread = await getThreadUseCase.execute(
      useCasePayload
    );

    // Assert
    expect(registeredCommentThread).toStrictEqual(
      new AddedCommentThread({
        id: 'comment-123',
        content: useCasePayload.content,
        owner: useCasePayload.owner,
      })
    );

    expect(mockThreadRepository.verifyAvailableThread).toBeCalledWith(
      useCasePayload.threadId
    );
    expect(mockCommentRepository.addComment).toBeCalledWith(
      new AddCommentThread({
        threadId: useCasePayload.threadId,
        content: useCasePayload.content,
        owner: useCasePayload.owner,
      })
    );
  });
});
