const GetThreadUseCase = require('../GetThreadUseCase');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');

describe('GetThreadUseCase', () => {
  it('should return thread with formatted comments', async () => {
    // arrange
    const threadId = 'thread123';
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockThreadRepository.getThread = jest.fn().mockImplementation(() =>
      Promise.resolve({
        id: 'thread123',
        title: 'Thread Title',
        content: 'Thread Content',
        date: '2022-01-01',
        username: 'dicoding',
      })
    );
    mockCommentRepository.getComments = jest.fn().mockImplementation(() =>
      Promise.resolve([
        {
          id: 'comment123',
          username: 'John Doe',
          date: '2022-01-01',
          content: 'Comment Content',
          is_delete: false,
        },
        {
          id: 'comment456',
          username: 'Jane Doe',
          date: '2022-01-02',
          content: 'Deleted Comment',
          is_delete: true,
        },
      ])
    );

    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // act
    const result = await getThreadUseCase.execute({ threadId });
    expect(mockThreadRepository.getThread).toHaveBeenCalledWith(threadId);
    expect(mockCommentRepository.getComments).toHaveBeenCalledWith(threadId);

    // assert
    expect(result).toStrictEqual({
      id: 'thread123',
      title: 'Thread Title',
      content: 'Thread Content',
      date: '2022-01-01',
      username: 'dicoding',
      comments: [
        {
          id: 'comment123',
          username: 'John Doe',
          date: '2022-01-01',
          content: 'Comment Content',
        },
        {
          id: 'comment456',
          username: 'Jane Doe',
          date: '2022-01-02',
          content: '**komentar telah dihapus**',
        },
      ],
    });
  });
});
