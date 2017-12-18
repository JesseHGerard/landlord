var bcrypt = require("bcrypt-nodejs");

module.exports = function(sequelize, DataTypes) {
	var Landlord = sequelize.define("Landlord", {
		uuid: {
			type: DataTypes.UUID,
			allowNull: false,
			primaryKey: true,
			defaultValue: DataTypes.UUIDV4,
		},
		phone: {
			type: DataTypes.STRING,
			allowNull: true,
			unique: true,
			validate: {
				isMobilePhone: 'any' // I think this is how it works?
			},
		},
		email: {
			type: DataTypes.STRING,
			allowNull: true,
			unique: true,
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
			defaultValue: DataTypes.NOW,
		},
		userType: {
			type: DataTypes.ENUM('landlord'),
			default: 'landlord',
			allowNull: false,
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

	Landlord.prototype.validPassword = function(password) {
		return bcrypt.compareSync(password, this.password);
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
