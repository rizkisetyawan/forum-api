const DeleteCommentThreadUseCase = require('../DeleteCommentThreadUseCase');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');

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
    const mockCommentRepository = new CommentRepository();

    mockThreadRepository.verifyAvailableThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyAvailableComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentOwner = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.deleteComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    const deleteCommentThreadUseCase = new DeleteCommentThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Act
    await deleteCommentThreadUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.verifyAvailableThread).toHaveBeenCalledWith(
      useCasePayload.threadId
    );
    expect(mockCommentRepository.verifyAvailableComment).toHaveBeenCalledWith(
      useCasePayload.commentId
    );
    expect(mockCommentRepository.verifyCommentOwner).toHaveBeenCalledWith(
      useCasePayload.commentId,
      useCasePayload.owner
    );
    expect(mockCommentRepository.deleteComment).toHaveBeenCalledWith(
      useCasePayload.commentId
    );
  });
});
