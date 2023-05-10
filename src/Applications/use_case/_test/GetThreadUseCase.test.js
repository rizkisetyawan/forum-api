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

    // assert
    expect(result.id).toBe('thread123');
    expect(result.title).toBe('Thread Title');
    expect(result.content).toBe('Thread Content');
    expect(result.comments).toHaveLength(2);
    expect(result.comments[0].id).toBe('comment123');
    expect(result.comments[0].username).toBe('John Doe');
    expect(result.comments[0].date).toBe('2022-01-01');
    expect(result.comments[0].content).toBe('Comment Content');
    expect(result.comments[1].id).toBe('comment456');
    expect(result.comments[1].username).toBe('Jane Doe');
    expect(result.comments[1].date).toBe('2022-01-02');
    expect(result.comments[1].content).toBe('**komentar telah dihapus**');
  });
});
