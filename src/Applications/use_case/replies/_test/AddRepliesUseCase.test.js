const AddReplyUseCase = require('../AddRepliesUseCase');
const CreateReply = require('../../../../Domains/replies/entities/CreateReply');
const CreatedReply = require('../../../../Domains/replies/entities/CreatedReply');
const CommentRepository = require('../../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../../Domains/replies/ReplyRepository');
const ThreadRepository = require('../../../../Domains/threads/ThreadRepository');

describe('AddReplyUseCase', () => {
    it('should orchestrating the add reply action correctly', async () => {
    // Arrange
    const useCasePayload = {
      content: 'Reply Pertama',
      owner: 'user-123',
      commentId: 'comment-123',
    };
    const expectedAddedReply = new CreatedReply({
      id: 'reply-123',
      content: useCasePayload.content,
      owner: useCasePayload.owner,
    });

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    mockThreadRepository.verifyAvailableIdThread = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyAvailableIdComment = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.createReply = jest.fn()
      .mockImplementation(() => Promise.resolve(new CreatedReply({
        id: 'reply-123',
        content: useCasePayload.content,
        owner: useCasePayload.owner,
      })));

    const addReplyUseCase = new AddReplyUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    // Action
    const addedReply = await addReplyUseCase.execute(useCasePayload);

    // Assert
    expect(addedReply).toStrictEqual(expectedAddedReply);
    expect(mockThreadRepository.verifyAvailableIdThread).toBeCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.verifyAvailableIdComment).toBeCalledWith(useCasePayload.commentId);
    expect(mockReplyRepository.createReply).toBeCalledWith(new CreateReply({
      content: useCasePayload.content,
      owner: useCasePayload.owner,
      commentId: useCasePayload.commentId,
    }));
  });
});
