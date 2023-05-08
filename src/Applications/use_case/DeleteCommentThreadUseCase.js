// const AddCommentThread = require('../../Domains/threads/entities/AddCommentThread');

class DeleteCommentThreadUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    this._validatePayload(useCasePayload);
    const { threadId, commentId, owner } = useCasePayload;
    await this._threadRepository.verifyAvailableThread(threadId);
    await this._threadRepository.verifyAvailableComment(commentId);
    await this._threadRepository.verifyCommentOwner(commentId, owner);
    await this._threadRepository.deleteComment(commentId);
  }

  _validatePayload(payload) {
    const { threadId, commentId, owner } = payload;
    if ((!threadId, !commentId, !owner)) {
      throw new Error(
        'DELETE_COMMENT_THREAD_USE_CASE.NOT_CONTAIN_PAYLOAD_PROPERLY'
      );
    }
  }
}

module.exports = DeleteCommentThreadUseCase;
