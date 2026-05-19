const { DataTypes } = require('sequelize');
const User = require('../model/User');

/**
 * Adds googleId and nullable password for Google OAuth without using sync({ alter: true }).
 */
async function ensureGoogleAuthSchema(sequelize) {
    const tableName = User.tableName || 'Users';
    const qi = sequelize.getQueryInterface();

    try {
        const table = await qi.describeTable(tableName);
        const colNames = Object.keys(table);
        const findCol = (name) => colNames.find((c) => c.toLowerCase() === name.toLowerCase());

        if (!findCol('googleId')) {
            await qi.addColumn(tableName, 'googleId', {
                type: DataTypes.STRING(255),
                allowNull: true,
            });
            try {
                await qi.addIndex(tableName, ['googleId'], {
                    unique: true,
                    name: 'users_google_id_unique',
                });
            } catch (idxErr) {
                if (!String(idxErr.message).includes('Duplicate')) {
                    console.warn('[Schema] googleId index:', idxErr.message);
                }
            }
        }
        const pwdKey = findCol('password');
        if (pwdKey && table[pwdKey].allowNull === false) {
            await qi.changeColumn(tableName, pwdKey, {
                type: DataTypes.STRING(255),
                allowNull: true,
            });
        }
    } catch (err) {
        console.warn('[Schema] ensureGoogleAuthSchema:', err.message);
    }
}

module.exports = { ensureGoogleAuthSchema };
