const AddThread = require('../../Domains/threads/entities/AddThread');

class GetThreadUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    const thread = await this._threadRepository.getThread(
      useCasePayload.threadId
    );
    const comments = await this._threadRepository.getComments(
      useCasePayload.threadId
    );
    return { ...thread, comments };
  }
}

module.exports = GetThreadUseCase;
