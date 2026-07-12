const { DataTypes } = require("sequelize");

module.exports = function DisposeModel(sequelize) {
  const Dispose = sequelize.define(
    "Dispose",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },

      chemicalId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: "chemical_id",
      },

      chemicalCode: {
        type: DataTypes.STRING(50),
        allowNull: false,
        field: "chemical_code",
      },

      chemicalName: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: "chemical_name",
      },

      batchCode: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: "batch_code",
      },

      quantityUsed: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        field: "quantity_used",
      },

      dateReleased: {
        type: DataTypes.DATE,
        allowNull: false,
        field: "date_released",
      },

      dateReturned: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "date_returned",
      },

      purpose: {
        type: DataTypes.TEXT,
        allowNull: false,
      },

      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: "user_id",
      },

      userName: {
        type: DataTypes.STRING(150),
        allowNull: false,
        field: "user_name",
      },

      remark: {
        type: DataTypes.TEXT,
        allowNull: true,
      },

      returnedStatus: {
        type: DataTypes.ENUM("RELEASED", "RETURNED", "DISPOSED"),
        allowNull: false,
        defaultValue: "RELEASED",
        field: "returned_status",
      },
    },
    {
      tableName: "disposals",
      timestamps: true,
      underscored: true,
    },
  );

  return Dispose;
};
