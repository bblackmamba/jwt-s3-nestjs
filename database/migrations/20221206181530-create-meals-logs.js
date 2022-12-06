module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('meals-logs', {
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
      statisticId: {
        type: Sequelize.INTEGER.UNSIGNED,
        references: {
          model: {
            tableName: 'statistics',
            schema: 'public',
          },
          key: 'id',
        },
        allowNull: false,
      },
      isEaten: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  async down (queryInterface) {
    await queryInterface.dropTable('meals-logs');
  }
};
