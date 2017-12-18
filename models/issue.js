module.exports = function(sequelize, DataTypes) {
	var Issue = sequelize.define("Issue", {
		description: {
			type: DataTypes.STRING,
			validate: {
				len: [1]
			},
		},
		quantity: {
			allowNull: false,
			type: DataTypes.INTEGER,
			defaultValue: 1,
		},
		category: {
			type: DataTypes.STRING,
		}
	});

	Issue.associate = function(models) {
		Issue.belongsTo(models.Tenant);
		Issue.belongsTo(models.Building, {onDelete: "cascade"});
	};

	return Issue;
};
