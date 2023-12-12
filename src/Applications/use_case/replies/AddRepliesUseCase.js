const CreateReply = require('../../../Domains/replies/entities/CreateReply');

class AddReplyUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(useCasePayload) {
    await this._threadRepository.verifyAvailableIdThread(useCasePayload.threadId);
    await this._commentRepository.verifyAvailableIdComment(useCasePayload.commentId);
    const createReply = new CreateReply(useCasePayload);
    return this._replyRepository.createReply(createReply);
  }
}

module.exports = AddReplyUseCase;