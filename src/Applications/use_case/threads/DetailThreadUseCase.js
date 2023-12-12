class DetailThreadUseCase {
  constructor({
    threadRepository, commentRepository, replyRepository, likeRepository,
  }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
    this._likeRepository = likeRepository;
  }

  async execute(useCasePayload) {
  
    const thread = await this._threadRepository.getDetailThread(useCasePayload);
    const comments = await this._commentRepository.getCommentsByThreadId(useCasePayload);
    const replies = await this._replyRepository.getRepliesByThreadId(useCasePayload);
    const validatedComments = this._validateDelComments(comments);
    const validatedReplies = this._validateDelReplies(replies);
    const commentsWithReplies = this._addReplyToComments(validatedComments, validatedReplies);
    const commentsWithRepliesAndLikeCount = await this._addLikeCountToComment(commentsWithReplies);
    
    return {
      ...thread,
      comments: commentsWithRepliesAndLikeCount,
    };
  }

  _validateDelComments(comments) {
    
    for (const comment of comments) {
      if (comment.is_delete) {
        comment.content = '**komentar telah dihapus**';
      }
      delete comment.is_delete;
    }
    return comments;
  }

  _validateDelReplies(replies) {

    for (const reply of replies) {
      if (reply.is_delete) {
        reply.content = '**balasan telah dihapus**';
      }
      delete reply.is_delete;
    }
    return replies;
  }

  _addReplyToComments(comments, replies) {
    
    for (const comment of comments) {
      comment.replies = [];

      for (const reply of replies) {
        if (reply.comment_id === comment.id) {
          comment.replies.push(reply);
        }
        delete reply.comment_id;
      }
    }
    return comments;
  }

  async _addLikeCountToComment(comments) {

    for (const comment of comments) {

      comment.likeCount = await this._likeRepository.getLikeCount(comment.id);
    }
    return comments;
  }
}

module.exports = DetailThreadUseCase;