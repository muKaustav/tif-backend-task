const bcrypt = require('bcrypt')
const Validator = require('validatorjs')
const { Snowflake } = require('@theinternetfolks/snowflake')

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        id: {
            type: DataTypes.STRING,
            defaultValue: () => Snowflake.generate(),
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: null,
            validate: {
                validator: (value) => {
                    const validation = new Validator({ name: value }, { name: 'required|string|min:2|max:255' })
                    if (validation.fails()) {
                        throw new Error(validation.errors.first('name'))
                    }
                },
            },
        },
        email: {
            type: DataTypes.STRING,
            unique: true,
            validate: {
                validator: (value) => {
                    const validation = new Validator({ email: value }, { email: 'required|email' })
                    if (validation.fails()) {
                        throw new Error(validation.errors.first('email'))
                    }
                },
            },
        },
        password: {
            type: DataTypes.STRING,
            validate: {
                validator: (value) => {
                    const validation = new Validator({ password: value }, { password: 'required|string|min:2|max:255' })
                    if (validation.fails()) {
                        throw new Error(validation.errors.first('password'))
                    }
                },
            }
        }
    }, {
        timestamps: true,
    })

    User.associate = models => {
        User.hasMany(models.Community, {
            foreignKey: 'owner',
            sourceKey: 'id',
            as: 'ownedCommunities',
        })

        User.hasMany(models.Member, {
            foreignKey: 'user',
            sourceKey: 'id',
            as: 'memberships',
        })
    }

    User.beforeCreate(async (user, options) => {
        if (user.password) {
            user.password = await bcrypt.hash(user.password, 10)
        }
    })

    return User
}