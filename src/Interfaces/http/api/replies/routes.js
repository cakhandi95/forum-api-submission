const routes = (handler) => [
  {
    method: "POST",
    path: "/threads/{threadId}/comments/{commentId}/replies",
    handler: (request, h) => handler.handleCreateReply(request, h),
    options: {
      auth: "forum_jwt",
    },
  },
  {
    method: "DELETE",
    path: "/threads/{threadId}/comments/{commentId}/replies/{replyId}",
    handler: (request) => handler.handleRemoveReply(request),
    options: {
      auth: "forum_jwt",
    },
  },
];

module.exports = routes;
