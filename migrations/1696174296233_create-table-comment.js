/* eslint-disable camelcase */

exports.up = (pgm) => {
    pgm.createTable('comments', {
      id: {
        type: 'VARCHAR(50)',
        primaryKey: true,
      },
      content: {
        type: 'TEXT',
        notNull: true,
      },
      owner: {
        type: 'VARCHAR(50)',
        notNull: true,
      },
      thread: {
        type: 'VARCHAR(50)',
        notNull: true,
      },
      date: {
        type: 'TEXT',
        notNull: true,
      },
      updated_at: {
        type: 'TEXT',
        notNull: true,
      },
      is_delete: {
        type: 'BOOLEAN',
        default: false,
        notNull: false,
      },
    });
    pgm.addConstraint('comments', 'fk_comments.user_owner.id', 'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE');
    pgm.addConstraint('comments', 'fk_comments.comment_thread.id', 'FOREIGN KEY(thread) REFERENCES threads(id) ON DELETE CASCADE');
  };
  
  exports.down = (pgm) => {
    pgm.dropTable('comments');
  };