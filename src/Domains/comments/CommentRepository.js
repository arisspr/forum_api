class CommentRepository {
    async addComment(addComment) {
      throw new Error('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    }
  
    async verifyAvailableIdComment(comment) {
      throw new Error('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    }
  
    async isTrueOwner(comment, owner) {
      throw new Error('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    }

    async deleteComment(comment) {
      throw new Error('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    }
  
    async getCommentsByThreadId(thread) {
      throw new Error('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    }
  }
  
  module.exports = CommentRepository;