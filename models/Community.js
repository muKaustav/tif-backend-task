const Validator = require('validatorjs')
const { Snowflake } = require('@theinternetfolks/snowflake')

module.exports = (sequelize, DataTypes) => {
    const Community = sequelize.define('Community', {
        id: {
            type: DataTypes.STRING,
            defaultValue: () => Snowflake.generate(),
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            validate: {
                validator: (value) => {
                    const validation = new Validator({ name: value }, { name: 'required|string|min:3|max:255' })
                    if (validation.fails()) {
                        throw new Error(validation.errors.first('name'))
                    }
                },
            },
        },
        slug: {
            type: DataTypes.STRING,
            unique: true,
            validate: {
                validator: (value) => {
                    const validation = new Validator({ slug: value }, { slug: 'required|string|min:3|max:255' })
                    if (validation.fails()) {
                        throw new Error(validation.errors.first('slug'))
                    }
                },
            },
        }
    }, {
        timestamps: true,
    })

    Community.associate = models => {
        Community.belongsTo(models.User, {
            foreignKey: 'owner',
            targetKey: 'id',
            as: 'ownerData',
        })

        Community.hasMany(models.Member, {
            foreignKey: 'community',
            sourceKey: 'id',
            as: 'members',
        })
    }

    return Community
}