module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('exercises_has_files', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER.UNSIGNED,
      },
      exerciseId: {
        type: Sequelize.INTEGER.UNSIGNED,
        references: {
          model: {
            tableName: 'exercises',
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

  async down(queryInterface) {
    await queryInterface.dropTable('exercises_has_files');
  },
};
