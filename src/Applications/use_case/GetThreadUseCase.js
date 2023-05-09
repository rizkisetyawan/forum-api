class GetThreadUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    const { threadId } = useCasePayload;
    const thread = await this._threadRepository.getThread(threadId);
    const comments = await this._threadRepository.getComments(threadId);
    const formatComments = this._formatComments(comments);
    return { ...thread, comments: formatComments };
  }

  _formatComments(comments) {
    return comments?.map((comment) => {
      const data = {
        id: comment.id,
        username: comment.username,
        date: comment.date,
        content: comment.content,
      };
      if (comment.is_delete) {
        return {
          ...data,
          content: '**komentar telah dihapus**',
        };
      }
      return data;
    });
  }
}

module.exports = GetThreadUseCase;
