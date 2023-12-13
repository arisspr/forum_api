const pool = require('../../database/postgres/pool');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const AddComment = require('../../../Domains/comments/entities/AddComment');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');

describe('CommentRepositoryPostgres', () => {
  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addComment function', () => {
    it('should persist create comment and return created comment correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' }); 
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' }); 
      const addComment = new AddComment({
        content: 'Comment content',
        owner: 'user-123',
        threadId: 'thread-123',
      });
      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const addedComment = await commentRepositoryPostgres.addComment(addComment);

      // Assert
      const comments = await CommentsTableTestHelper.findCommentsById(addedComment.id);
      expect(comments).toHaveLength(1);
      expect(addedComment).toStrictEqual(new AddedComment({
        id: 'comment-123',
        content: addComment.content,
        owner: addComment.owner,
      }));
    });
  });

  describe('verifyAvailableIdComment function', () => {
    it('should throw NotFoundError when comment not found', () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      return expect(commentRepositoryPostgres.verifyAvailableIdComment('hello-world'))
        .rejects
        .toThrowError(NotFoundError);
    });

    it('should not throw NotFoundError when comment found', async () => {
      // Arrange
      const commentId = 'comment-123';
      await UsersTableTestHelper.addUser({ id: 'user-123' }); 
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' }); 
      await CommentsTableTestHelper.addComment({ id: commentId });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      return expect(commentRepositoryPostgres.verifyAvailableIdComment(commentId))
        .resolves.not.toThrowError(NotFoundError);
    });
  });

  describe('isTrueOwner function', () => {
    it('should throw UnauthorizedError when provided userId is not the comment owner', async () => {
      // Arrange
      const commentId = 'comment-123';
      const userId = 'user-123';
      const wrongUserId = 'user-456';
      await UsersTableTestHelper.addUser({ id: userId }); 
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' }); 
      await CommentsTableTestHelper.addComment({ id: commentId });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      expect(commentRepositoryPostgres.isTrueOwner(commentId, wrongUserId))
        .rejects.toThrowError(AuthorizationError);
    });

    it('should verify the comment owner correctly', async () => {
      // Arrange
      const commentId = 'comment-123';
      const userId = 'user-123';
      await UsersTableTestHelper.addUser({ id: userId }); 
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' }); 
      await CommentsTableTestHelper.addComment({ id: commentId });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      expect(commentRepositoryPostgres.isTrueOwner(commentId, userId))
        .resolves.not.toThrowError(AuthorizationError);
    });
  });

  describe('deleteComment function', () => {
    it('should throw NotFoundError when comment not found', () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      return expect(commentRepositoryPostgres.deleteComment('hello-world'))
        .rejects
        .toThrowError(NotFoundError);
    });

    it('should delete comment by id and return success correctly', async () => {
      // Arrange
      const commentId = 'comment-123';
      await UsersTableTestHelper.addUser({ id: 'user-123' }); 
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      await CommentsTableTestHelper.addComment({ id: commentId });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action
      await commentRepositoryPostgres.deleteComment(commentId);

      // Assert
      const comments = await CommentsTableTestHelper.findCommentsById(commentId);
      expect(comments).toHaveLength(1);
      expect(comments[0].is_delete).toEqual(true);
    });
  });

  describe('getCommentsByThreadId function', () => {
    it('should get comments by thread ID correctly', async () => {
      // Arrange
      const threadId = 'thread-123';
      await UsersTableTestHelper.addUser({ id: 'user-123' }); 
      await ThreadsTableTestHelper.addThread({ id: threadId }); 
      await CommentsTableTestHelper.addComment({
        id: 'comment-123', 
        threadId,
        created_at: '2023-12-08T07:19:09.775Z', 
      });
      await CommentsTableTestHelper.addComment({
        id: 'comment-456', 
        threadId,
        created_at: '2023-12-08T07:19:09.775Z',
      });
      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const comments = await commentRepositoryPostgres.getCommentsByThreadId(threadId);

      // Assert
      expect(comments).toBeDefined();
      expect(comments).toHaveLength(2);
      expect(comments[0].id).toEqual('comment-123');
      expect(comments[0].created_at).toEqual('2023-12-08T07:19:09.775Z');
      expect(comments[0].username).toEqual('dicoding'); 
      expect(comments[0].content).toEqual('sebuah komentar'); 
      expect(comments[0].is_delete).toEqual(false); 
      expect(comments[1].id).toEqual('comment-456');
      expect(comments[1].created_at).toEqual('2023-12-08T07:19:09.775Z');
      expect(comments[1].username).toEqual('dicoding'); 
      expect(comments[1].content).toEqual('sebuah komentar'); 
      expect(comments[1].is_delete).toEqual(false); 
    });

    it('should show empty array if no comment found by thread ID', async () => {
      // Arrange
      const threadId = 'thread-123';
      await UsersTableTestHelper.addUser({ id: 'user-123' }); // add user with id user-123
      await ThreadsTableTestHelper.addThread({ id: threadId }); // add thread with id thread-123
      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const comments = await commentRepositoryPostgres.getCommentsByThreadId(threadId);

      // Assert
      expect(comments).toBeDefined();
      expect(comments).toHaveLength(0);
    });
  });
});
