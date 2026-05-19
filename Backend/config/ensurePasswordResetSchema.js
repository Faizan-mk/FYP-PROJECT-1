const { DataTypes } = require('sequelize');
const User = require('../model/User');

/**
 * Adds password reset token columns without sync({ alter: true }).
 */
async function ensurePasswordResetSchema(sequelize) {
    const tableName = User.tableName || 'Users';
    const qi = sequelize.getQueryInterface();

    try {
        const table = await qi.describeTable(tableName);
        const colNames = Object.keys(table);
        const findCol = (name) => colNames.find((c) => c.toLowerCase() === name.toLowerCase());

        if (!findCol('resetPasswordToken')) {
            await qi.addColumn(tableName, 'resetPasswordToken', {
                type: DataTypes.STRING(255),
                allowNull: true,
            });
        }
        if (!findCol('resetPasswordExpire')) {
            await qi.addColumn(tableName, 'resetPasswordExpire', {
                type: DataTypes.DATE,
                allowNull: true,
            });
        }
    } catch (err) {
        console.warn('[Schema] ensurePasswordResetSchema:', err.message);
    }
}

module.exports = { ensurePasswordResetSchema };
