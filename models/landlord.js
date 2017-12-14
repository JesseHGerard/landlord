module.exports = function(sequelize, DataTypes) {
	var Landlord = sequelize.define("Landlord", {
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
		password: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		lastLogin: {
			type: DataTypes.DATE,
		},
	}, {
		validate: {
			emailOrPhone() {
				if (this.phone === null && this.email === null) {
					throw new Error("Landlords must have an email address or a phone number");
				}
			}
		}
	});

	Landlord.associate = function(models) {
		Landlord.belongsTo(models.Building, {
			foreignKey: {
				allowNull: false
			}
		});
	};
	
	Landlord.hook("beforeCreate", function(instance) {
		if (instance.password) instance.password = bcrypt.hashSync(instance.password, bcrypt.genSaltSync(10), null);
	});
	
	Landlord.hook("beforeBulkUpdate", function(instances) {
		instances.individualHooks = true;
	});
	
	Landlord.hook("beforeUpdate", function(instance, options) {
		if (options.fields.includes("password")) {
			instance.password = bcrypt.hashSync(instance.password, bcrypt.genSaltSync(10), null);
		}
	});

	return Landlord;
};