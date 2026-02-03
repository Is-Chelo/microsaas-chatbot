"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Modulo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.rolesModulo, {
        foreignKey: "idModulo",
      });
      
    }
  }
  Modulo.init(
    {
      nombre: DataTypes.STRING,
      url: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Modulo",
    }
  );
  return Modulo;
};
