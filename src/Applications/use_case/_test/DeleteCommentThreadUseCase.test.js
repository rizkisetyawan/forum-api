const DeleteCommentThreadUseCase = require('../DeleteCommentThreadUseCase');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');

describe('DeleteCommentThreadUseCase', () => {
  it('should throw error if use case payload not contain payload properly', async () => {
    // Arrange
    const useCasePayload = {};
    const deleteCommentThreadUseCase = new DeleteCommentThreadUseCase({});

    // Action & Assert
    await expect(
      deleteCommentThreadUseCase.execute(useCasePayload)
    ).rejects.toThrowError(
      'DELETE_COMMENT_THREAD_USE_CASE.NOT_CONTAIN_PAYLOAD_PROPERLY'
    );
  });

  it('should orchestrating the delete comment thread action correctly', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      owner: 'user-123',
    };
    const mockThreadRepository = new ThreadRepository();
    mockThreadRepository.verifyAvailableThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockThreadRepository.verifyAvailableComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockThreadRepository.verifyCommentOwner = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockThreadRepository.deleteComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    const deleteCommentThreadUseCase = new DeleteCommentThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    // Act
    await deleteCommentThreadUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.verifyAvailableThread).toHaveBeenCalledWith(
      useCasePayload.threadId
    );
    expect(mockThreadRepository.verifyAvailableComment).toHaveBeenCalledWith(
      useCasePayload.commentId
    );
    expect(mockThreadRepository.verifyCommentOwner).toHaveBeenCalledWith(
      useCasePayload.commentId,
      useCasePayload.owner
    );
    expect(mockThreadRepository.deleteComment).toHaveBeenCalledWith(
      useCasePayload.commentId
    );
  });
});
