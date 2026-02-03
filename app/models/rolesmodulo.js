"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class rolesModulo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // this.belongsTo(models.Modulo, {
      //   foreignKey: "idModulo",
      // });
      // this.belongsTo(models.Role, {
      //   foreignKey: "idRol",
      // });
    }
  }
  rolesModulo.init(
    {
      idModulo: DataTypes.INTEGER,
      idRol: DataTypes.INTEGER,
      okSelect: DataTypes.BOOLEAN,
      okUpdate: DataTypes.BOOLEAN,
      okInsert: DataTypes.BOOLEAN,
      okDelete: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "rolesModulo",
    }
  );
  return rolesModulo;
};
