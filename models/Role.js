const Validator = require('validatorjs')
const { Snowflake } = require('@theinternetfolks/snowflake')

module.exports = (sequelize, DataTypes) => {
    const Role = sequelize.define('Role', {
        id: {
            type: DataTypes.STRING,
            defaultValue: () => Snowflake.generate(),
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            unique: true,
            validate: {
                validator: (value) => {
                    const validation = new Validator({ name: value }, { name: 'required|string|min:2|max:255' })
                    if (validation.fails()) {
                        throw new Error(validation.errors.first('name'))
                    }
                },
            },
        },
        scopes: {
            type: DataTypes.ARRAY(DataTypes.STRING),
            defaultValue: [],
        }
    }, {
        timestamps: true,
    })

    Role.associate = models => {
        Role.hasMany(models.Member, {
            foreignKey: 'role',
            sourceKey: 'id',
            as: 'members',
        })
    }

    return Role
}