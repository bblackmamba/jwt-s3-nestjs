module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('roles', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER.UNSIGNED,
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        defaultValue: new Date(),
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        defaultValue: new Date(),
        type: Sequelize.DATE,
      },
    }).then(() => queryInterface.addColumn('users', 'roleId', {
      type: Sequelize.INTEGER.UNSIGNED,
      references: {
        model: {
          tableName: 'roles',
          schema: 'public',
        },
        key: 'id',
      },
      allowNull: false,
    })).then(() => queryInterface.bulkInsert('roles', [
      { name: 'user' },
      { name: 'coah' },
      { name: 'admin' },
    ]))
  },
  async down(queryInterface) {
    await queryInterface.removeColumn(
      'users',
      'roleId',
    ).then(() => queryInterface.dropTable('roles'));
  },
};
