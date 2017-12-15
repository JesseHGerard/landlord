module.exports = function(sequelize, DataTypes) {
	var AreaCode = sequelize.define("AreaCode", {
		code: {
			type: DataTypes.INTEGER,
		},
		city: {
			type: DataTypes.STRING,
		},
		state: {
			type: DataTypes.STRING,
		},
    country: {
			type: DataTypes.STRING,
		},
    lat: {
			type: DataTypes.FLOAT,
		},
    long: {
			type: DataTypes.FLOAT,
		}
	});
  AreaCode.removeAttribute('id');
  AreaCode.removeAttribute('createdAt');
  AreaCode.removeAttribute('updatedAt');

	return AreaCode;
};
