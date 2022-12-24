module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('meals_has_files', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER.UNSIGNED,
      },
      mealId: {
        type: Sequelize.INTEGER.UNSIGNED,
        references: {
          model: {
            tableName: 'meals',
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
    await queryInterface.dropTable('meals_has_files');
  },
};
