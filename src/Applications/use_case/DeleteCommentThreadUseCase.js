// const AddCommentThread = require('../../Domains/threads/entities/AddCommentThread');

class DeleteCommentThreadUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    // const addComment = new AddCommentThread(useCasePayload);
    const { threadId, commentId, owner } = useCasePayload;
    await this._threadRepository.verifyAvailableThread(threadId);
    await this._threadRepository.verifyAvailableComment(commentId);
    await this._threadRepository.verifyCommentOwner(commentId, owner);
    await this._threadRepository.deleteComment(commentId);
  }
}

module.exports = DeleteCommentThreadUseCase;
