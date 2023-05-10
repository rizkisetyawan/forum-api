class AddCommentThread {
  constructor(payload) {
    this._verifyPayload(payload);

    const { id, content, owner } = payload;

    this.id = id;
    this.content = content;
    this.owner = owner;
  }

  _verifyPayload({ id, content, owner }) {
    if (!id || !content || !owner) {
      throw new Error('ADDED_COMMENT_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    }
  }
}

module.exports = AddCommentThread;
