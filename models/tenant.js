module.exports = function(sequelize, DataTypes) {
	var Tenant = sequelize.define("Tenant", {
		phone: {
			type: DataTypes.STRING,
			allowNull: true,
			validate: {
				isMobilePhone: 'any' // I think this is how it works?
			},
		},
		email: {
			type: DataTypes.STRING,
			allowNull: true,
			validate: {
				isEmail: true
			},
		},
		name: {
			type: DataTypes.STRING,
			validate: {
				len: [1]
			},
		},
		apt: {
			type: DataTypes.STRING,
		},
		password: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		lastLogin: {
			type: DataTypes.DATE,
			defaultValue: DataTypes.NOW,
		},
	}, {
		validate: {
			emailOrPhone() {
				if (this.phone === null && this.email === null) {
					throw new Error("Users must have an email address or a phone number");
				}
			}
		}
	});

	Tenant.associate = function(models) {
		Tenant.belongsTo(models.Building, {
			foreignKey: {
				allowNull: false
			}
		});
		Tenant.hasMany(models.Issue);
	};

	return Tenant;
};