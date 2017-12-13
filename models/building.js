module.exports = function(sequelize, DataTypes) {
	var Building = sequelize.define("Building", {
		phone: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				isMobilePhone: 'any' // I think this is how it works?
			},
		},
		address: {
			type: DataTypes.STRING,
			validate: {
				len: [1]
			},
		},
	});

	Building.associate = function(models) {
		Building.hasMany(models.Tenant, {
			onDelete: "cascade"
		});
		Building.hasOne(models.Landlord, {
			onDelete: "cascade"
		});
		Building.hasMany(models.Issue, {
			onDelete: "cascade"
		});
	};

	return Building;
};