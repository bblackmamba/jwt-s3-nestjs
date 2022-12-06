module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('meals', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER.UNSIGNED,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      calories: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
      },
      weight: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
      },
      pfc: {
        type: Sequelize.STRING,
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
    await queryInterface.dropTable('meals');
  }
};
