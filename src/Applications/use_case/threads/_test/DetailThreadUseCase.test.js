const DetailThreadUseCase = require('../DetailThreadUseCase');
const ThreadRepository = require('../../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../../Domains/replies/ReplyRepository');
const LikeRepository = require('../../../../Domains/likes/LikeRepository');

describe('DetailThreadUseCase', () => {

  it('should orchestrating the show thread action correctly', async () => {
    // Arrange
    const useCasePayload = 'thread-123';
    const expectedThread = {
      id: 'thread-123',
      title: 'Thread Title',
      body: 'Thread Body',
      username: 'user-123',
      date: '2023-10-08T07:26:17.018Z',
    };
    const expectedComments = [
      {
        id: 'comment-123',
        username: 'user-123',
        date: '2023-10-08T07:26:17.018Z',
        content: 'Comment Content',
        is_delete: false,
      },
      {
        id: 'comment-124',
        username: 'user-123',
        date: '2023-10-08T07:26:17.018Z',
        content: 'Comment Content 2',
        is_delete: true,
      },
    ];
    const expectedReplies = [
      {
        id: 'reply-123',
        content: 'reply Content',
        date: '2023-10-08T07:26:17.018Z',
        username: 'user-123',
        is_delete: false,
        comment_id: 'comment-123',
      },
      {
        id: 'reply-124',
        content: 'reply Content 2',
        date: '2023-10-08T07:26:17.018Z',
        username: 'user-123',
        is_delete: true,
        comment_id: 'comment-123',
      },
    ];
    const expectedDetailThread = {
      id: 'thread-123',
      title: 'Thread Title',
      body: 'Thread Body',
      date: '2023-10-08T07:26:17.018Z',
      username: 'user-123',
      comments: [
        {
          id: 'comment-123',
          username: 'user-123',
          date: '2023-10-08T07:26:17.018Z',
          replies: [
            {
              id: 'reply-123',
              content: 'reply Content',
              date: '2023-10-08T07:26:17.018Z',
              username: 'user-123',
            },
            {
              id: 'reply-124',
              content: '**balasan telah dihapus**',
              date: '2023-10-08T07:26:17.018Z',
              username: 'user-123',
            },
          ],
          content: 'Comment Content',
          likeCount: 1,
        },
        {
          id: 'comment-124',
          username: 'user-123',
          date: '2023-10-08T07:26:17.018Z',
          replies: [],
          content: '**komentar telah dihapus**',
          likeCount: 1,
        },
      ],
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();
    const mockLikeRepository = new LikeRepository();

    mockThreadRepository.getDetailThread = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedThread));
    mockCommentRepository.getCommentsByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedComments));
    mockReplyRepository.getRepliesByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedReplies));
    mockLikeRepository.getLikeCount = jest.fn()
      .mockImplementation(() => Promise.resolve(1));

    const detailThreadUseCase = new DetailThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
      likeRepository: mockLikeRepository,
    });

    // Action
    const detailThread = await detailThreadUseCase.execute(useCasePayload);
    
    // Assert
    expect(detailThread).toStrictEqual(expectedDetailThread);
    expect(mockThreadRepository.getDetailThread).toBeCalledWith(useCasePayload);
    expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(useCasePayload);
    expect(mockReplyRepository.getRepliesByThreadId).toBeCalledWith(useCasePayload);
    expect(mockLikeRepository.getLikeCount).toBeCalledWith('comment-123');
    expect(mockLikeRepository.getLikeCount).toBeCalledWith('comment-124');
  });
});
