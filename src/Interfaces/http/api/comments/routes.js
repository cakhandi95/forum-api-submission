const routes = (handler) => [
  {
    method: "POST",
    path: "/threads/{threadId}/comments",
    handler: (request, h) => handler.handleCreateComment(request, h),
    options: {
      auth: "forum_jwt",
    },
  },
  {
    method: "DELETE",
    path: "/threads/{threadId}/comments/{commentId}",
    handler: (request) => handler.handleRemoveComment(request),
    options: {
      auth: "forum_jwt",
    },
  },
];

module.exports = routes;
