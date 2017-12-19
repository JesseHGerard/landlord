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
		},
		class: {
			type: DataTypes.ENUM('Pests', 'Infrastructure', 'People'),
			allowNull: true,
		},
		noted: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false,
		}
	});

	Issue.associate = function(models) {
		Issue.belongsTo(models.Tenant);
		Issue.belongsTo(models.Building, {onDelete: "cascade"});
	};
	
	Issue.hook("beforeBulkCreate", function(instances) {
		instances.individualHooks = true;
	});
	
	Issue.hook("beforeCreate", function(instance) {
		if (instance.category) instance.class = instance.categoryClass();
	});

	Issue.hook("beforeBulkUpdate", function(instances) {
		instances.individualHooks = true;
	});

	Issue.hook("beforeUpdate", function(instance, options) {
		if (options.fields.includes("category")) {
			instance.class = instance.categoryClass();
		}
	});
	
	Issue.prototype.categoryClass = function() {
		switch(this.category) {
			case 'Roaches':
			case 'Bed Bugs':
			case 'Mice':
				return 'Pests';
			case 'Leak':
			case 'Light Bulb':
				return 'Infrastructure';
			case 'Stolen Mail':
			case 'Noise':
				return 'People';
			default:
				return null;
		}
	}

	return Issue;
};
