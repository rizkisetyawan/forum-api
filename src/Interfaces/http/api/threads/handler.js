const AddThreadUseCase = require('../../../../Applications/use_case/AddThreadUseCase');
const AddCommentThreadUseCase = require('../../../../Applications/use_case/AddCommentThreadUseCase');
const DeleteCommentThreadUseCase = require('../../../../Applications/use_case/DeleteCommentThreadUseCase');
const GetThreadUseCase = require('../../../../Applications/use_case/GetThreadUseCase');

class ThreadsHandler {
  constructor(container) {
    this._container = container;

    this.getThreadHandler = this.getThreadHandler.bind(this);
    this.postThreadHandler = this.postThreadHandler.bind(this);
    this.postCommentThreadHandler = this.postCommentThreadHandler.bind(this);
    this.deleteCommentThreadHandler =
      this.deleteCommentThreadHandler.bind(this);
  }

  async getThreadHandler(request, h) {
    const getThreadUseCase = this._container.getInstance(GetThreadUseCase.name);
    const { id: threadId } = request.params;
    const thread = await getThreadUseCase.execute({
      threadId,
    });

    const response = h.response({
      status: 'success',
      data: {
        thread,
      },
    });
    response.code(200);
    return response;
  }

  async postThreadHandler(request, h) {
    const addThreadUseCase = this._container.getInstance(AddThreadUseCase.name);
    const { id: owner } = request.auth.credentials;
    const addedThread = await addThreadUseCase.execute({
      ...request.payload,
      owner,
    });

    const response = h.response({
      status: 'success',
      data: {
        addedThread,
      },
    });
    response.code(201);
    return response;
  }

  async postCommentThreadHandler(request, h) {
    const addCommentThreadUseCase = this._container.getInstance(
      AddCommentThreadUseCase.name
    );
    const { id: owner } = request.auth.credentials;
    const { id: threadId } = request.params;
    const addedComment = await addCommentThreadUseCase.execute({
      ...request.payload,
      threadId,
      owner,
    });

    const response = h.response({
      status: 'success',
      data: {
        addedComment,
      },
    });
    response.code(201);
    return response;
  }

  async deleteCommentThreadHandler(request, h) {
    const deleteCommentThreadUseCase = this._container.getInstance(
      DeleteCommentThreadUseCase.name
    );
    const { id: owner } = request.auth.credentials;
    const { threadId, commentId } = request.params;
    await deleteCommentThreadUseCase.execute({
      threadId,
      commentId,
      owner,
    });

    const response = h.response({
      status: 'success',
    });
    response.code(200);
    return response;
  }
}

module.exports = ThreadsHandler;
