module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable('tokens', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER.UNSIGNED,
      },
      userId: {
        type: Sequelize.INTEGER.UNSIGNED,
        references: {
          model: {
            tableName: 'users',
            schema: 'public',
          },
          key: 'id',
        },
        allowNull: false,
      },
      sessionId: {
        allowNull: false,
        type: Sequelize.STRING(30),
      },
      accessToken: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      refreshToken: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      accessExpires: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      refreshExpires: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      revoke: {
        defaultValue: false,
        type: Sequelize.BOOLEAN,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    })
      .then(() => queryInterface.addIndex('tokens', ['userId']));
  },
  async down(queryInterface) {
    return queryInterface.removeIndex('tokens', ['userId'])
      .then(() => queryInterface.dropTable('tokens'));
  },
};
