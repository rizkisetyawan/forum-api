const routes = (handler) => [
  {
    method: 'GET',
    path: '/threads/{id}',
    handler: handler.getThreadHandler,
  },
  {
    method: 'POST',
    path: '/threads',
    handler: handler.postThreadHandler,
    options: {
      auth: 'forum_jwt',
    },
  },
  {
    method: 'POST',
    path: '/threads/{id}/comments',
    handler: handler.postCommentThreadHandler,
    options: {
      auth: 'forum_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/threads/{threadId}/comments/{commentId}',
    handler: handler.deleteCommentThreadHandler,
    options: {
      auth: 'forum_jwt',
    },
  },
];

module.exports = routes;
