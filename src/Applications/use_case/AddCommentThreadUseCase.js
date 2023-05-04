const AddCommentThread = require('../../Domains/threads/entities/AddCommentThread');

class AddCommentThreadUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    const addComment = new AddCommentThread(useCasePayload);
    await this._threadRepository.verifyAvailableThread(useCasePayload.threadId);
    return this._threadRepository.addComment(addComment);
  }
}

module.exports = AddCommentThreadUseCase;
