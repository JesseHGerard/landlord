var bcrypt = require("bcrypt-nodejs");

module.exports = function(sequelize, DataTypes) {
	var Tenant = sequelize.define("Tenant", {
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
		userType: {
			type: DataTypes.ENUM('tenant'),
			default: 'tenant',
			allowNull: false,
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

	Tenant.prototype.validPassword = function(password) {
		return bcrypt.compareSync(password, this.password);
	};

	Tenant.hook("beforeCreate", function(instance) {
		if (instance.password) instance.password = bcrypt.hashSync(instance.password, bcrypt.genSaltSync(10), null);
	});

	Tenant.hook("beforeBulkUpdate", function(instances) {
		instances.individualHooks = true;
	});

	Tenant.hook("beforeUpdate", function(instance, options) {
		if (options.fields.includes("password")) {
			instance.password = bcrypt.hashSync(instance.password, bcrypt.genSaltSync(10), null);
		}
	});

	return Tenant;
};
