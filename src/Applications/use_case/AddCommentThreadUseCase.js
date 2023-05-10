const AddCommentThread = require('../../Domains/comments/entities/AddCommentThread');

class AddCommentThreadUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    const addComment = new AddCommentThread(useCasePayload);
    await this._threadRepository.verifyAvailableThread(useCasePayload.threadId);
    return this._commentRepository.addComment(addComment);
  }
}

module.exports = AddCommentThreadUseCase;
