module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('articles-has-files', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER.UNSIGNED,
      },
      articleId: {
        type: Sequelize.INTEGER.UNSIGNED,
        references: {
          model: {
            tableName: 'articles',
            schema: 'public',
          },
          key: 'id',
        },
        allowNull: false,
      },
      fileId: {
        type: Sequelize.INTEGER.UNSIGNED,
        references: {
          model: {
            tableName: 'files',
            schema: 'public',
          },
          key: 'id',
        },
        allowNull: false,
      },
    });
  },

  async down (queryInterface) {
    await queryInterface.dropTable('articles-has-files');
  }
};
