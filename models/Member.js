const Validator = require('validatorjs')
const { Snowflake } = require('@theinternetfolks/snowflake')

module.exports = (sequelize, DataTypes) => {
    const Member = sequelize.define('Member', {
        id: {
            type: DataTypes.STRING,
            defaultValue: () => Snowflake.generate(),
            primaryKey: true,
        },
    }, {
        timestamps: true,
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