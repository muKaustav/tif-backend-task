const { Snowflake } = require('@theinternetfolks/snowflake')

module.exports = (sequelize, DataTypes) => {
    const Member = sequelize.define('Member', {
        id: {
            type: DataTypes.STRING,
            defaultValue: () => Snowflake.generate(),
            primaryKey: true,
        },
        user: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                async isUser(value) {
                    const user = await sequelize.models.User.findByPk(value)
                    if (!user) {
                        throw new Error('User does not exist')
                    }
                },
            },
        },
        community: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                async isCommunity(value) {
                    const community = await sequelize.models.Community.findByPk(value)
                    if (!community) {
                        throw new Error('Community does not exist')
                    }
                },
            },
        },
        role: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                async isRole(value) {
                    const role = await sequelize.models.Role.findByPk(value)
                    if (!role) {
                        throw new Error('Role does not exist')
                    }
                },
            },
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        }
    })

    Member.associate = models => {
        Member.belongsTo(models.User, {
            foreignKey: 'user',
            targetKey: 'id',
            as: 'userData',
        })
        Member.belongsTo(models.Community, {
            foreignKey: 'community',
            targetKey: 'id',
            as: 'communityData',
        })
        Member.belongsTo(models.Role, {
            foreignKey: 'role',
            targetKey: 'id',
            as: 'roleData',
        })
    }

    return Member
}