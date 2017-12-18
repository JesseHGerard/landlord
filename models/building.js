module.exports = function(sequelize, DataTypes) {
	var Building = sequelize.define("Building", {
		phone: {
			type: DataTypes.STRING,
			allowNull: false,
			// validate: {
			// 	isMobilePhone: 'any' // I think this is how it works?
			// },
		},
		address: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
			validate: {
				len: [1],
			},
		},
	});

	Building.associate = function(models) {
		Building.hasOne(models.Landlord);
		Building.hasMany(models.Tenant);
		Building.hasMany(models.Issue);
	};

	return Building;
};
