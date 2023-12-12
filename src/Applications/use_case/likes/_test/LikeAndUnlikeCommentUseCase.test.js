const LikeAndUnlikeUseCase = require('../LikeAndUnlikeCommentUseCase');
const CommentRepository = require('../../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../../Domains/threads/ThreadRepository');
const LikeRepository = require('../../../../Domains/likes/LikeRepository');

describe('LikeAndUnlikeUseCase', () => {
  
  it('should orchestrating the add like action correctly if like DOES NOT exist', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      owner: 'user-123',
    };


    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockLikeRepository = new LikeRepository();

    mockThreadRepository.verifyAvailableIdThread = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyAvailableIdComment = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockLikeRepository.verifyLikeIsExist = jest.fn()
      .mockImplementation(() => Promise.resolve(false)); 
    mockLikeRepository.createLike = jest.fn()
      .mockImplementation(() => Promise.resolve());

    const likeandunlikeUseCase = new LikeAndUnlikeUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      likeRepository: mockLikeRepository,
    });

    // Action
    await likeandunlikeUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.verifyAvailableIdThread).toBeCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.verifyAvailableIdComment).toBeCalledWith(useCasePayload.commentId);
    expect(mockLikeRepository.verifyLikeIsExist)
      .toBeCalledWith(useCasePayload.commentId, useCasePayload.owner);
    expect(mockLikeRepository.createLike)
      .toBeCalledWith(useCasePayload.commentId, useCasePayload.owner);
  });

  it('should orchestrating the delete like action correctly if like DOES already exist', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      owner: 'user-123',
    };

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockLikeRepository = new LikeRepository();

    /** mocking needed function */
    mockThreadRepository.verifyAvailableIdThread = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyAvailableIdComment = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockLikeRepository.verifyLikeIsExist = jest.fn()
      .mockImplementation(() => Promise.resolve(true)); // like already exist
    mockLikeRepository.deleteLike = jest.fn()
      .mockImplementation(() => Promise.resolve());

    /** creating use case instance */
    const likeandunlikeUseCase = new LikeAndUnlikeUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      likeRepository: mockLikeRepository,
    });

    // Action
    await likeandunlikeUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.verifyAvailableIdThread).toBeCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.verifyAvailableIdComment).toBeCalledWith(useCasePayload.commentId);
    expect(mockLikeRepository.verifyLikeIsExist)
      .toBeCalledWith(useCasePayload.commentId, useCasePayload.owner);
    expect(mockLikeRepository.deleteLike)
      .toBeCalledWith(useCasePayload.commentId, useCasePayload.owner);
  });
});
