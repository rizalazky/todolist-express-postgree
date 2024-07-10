'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn('Items','myday',{
      type : Sequelize.DataTypes.BOOLEAN,
      defaultValue : false
    });
    await queryInterface.addColumn('Items','important',{
      type : Sequelize.DataTypes.BOOLEAN,
      defaultValue : false
    });
    await queryInterface.addColumn('Items','duedate',{
      type : Sequelize.DataTypes.DATEONLY,
      allowNull : true
    });
    await queryInterface.addColumn('Items','notes',{
      type : Sequelize.DataTypes.TEXT,
      allowNull : true
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn('Items','myday');
    await queryInterface.removeColumn('Items','important');
    await queryInterface.removeColumn('Items','duedate');
    await queryInterface.removeColumn('Items','notes');
  }
};
