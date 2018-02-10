module.exports = (sequelize, DataTypes) => {

    const Find = sequelize.define("Find", {
        user: {
            type: DataTypes.STRING,
            validate: {
                isEmail: true
            }
        },
        item: {
            type: DataTypes.STRING
        },
        description: {
            type: DataTypes.TEXT
        },
        longitude: {
            type: DataTypes.STRING
        },
        lattitude: {
            type: DataTypes.STRING
        },
        reward: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        isLost: {
            type: DataTypes.BOOLEAN
        }
    });
    return Find;
}