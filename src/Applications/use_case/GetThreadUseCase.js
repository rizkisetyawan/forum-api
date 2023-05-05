class GetThreadUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    const { threadId } = useCasePayload;
    const thread = await this._threadRepository.getThread(threadId);
    const comments = await this._threadRepository.getComments(threadId);
    return { ...thread, comments };
  }
}

module.exports = GetThreadUseCase;
