const LikeAndUnlikeUseCase = require('../../../../Applications/use_case/likes/LikeAndUnlikeCommentUseCase');

class LikesHandler {
  constructor(container) {
    this._container = container;
    this.putLikeHandler = this.putLikeHandler.bind(this);
  }

  async putLikeHandler(request, h) {
    const { id: userId } = request.auth.credentials;
    const { threadId, commentId } = request.params;
    const likeandUnlikeUseCase = this._container.getInstance(LikeAndUnlikeUseCase.name);
  
    await likeandUnlikeUseCase.execute({
      owner: userId, threadId, commentId,
    });

    const response = h.response({ status: 'success' });
    response.code(200);
    return response;
  }
}

module.exports = LikesHandler;
