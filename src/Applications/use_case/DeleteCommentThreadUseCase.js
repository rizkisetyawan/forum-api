class DeleteCommentThreadUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    this._validatePayload(useCasePayload);
    const { threadId, commentId, owner } = useCasePayload;
    await this._threadRepository.verifyAvailableThread(threadId);
    await this._commentRepository.verifyAvailableComment(commentId);
    await this._commentRepository.verifyCommentOwner(commentId, owner);
    await this._commentRepository.deleteComment(commentId);
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
