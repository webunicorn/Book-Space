module.exports = (sequelize, DataTypes) => {
    const Wish = sequelize.define('Wish', {
        title: {
            type: DataTypes.STRING(200),
            allowNull: false,
        },
        author: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        isbn: { 
            type: DataTypes.STRING(20),
            allowNull: false,
        },
        src: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
    }, {
        charset: 'utf8mb4',
        collate: 'utf8mb4_general_ci',
    });

    Wish.associate = (db) => {
        db.Wish.belongsTo(db.User);
    };

    return Wish;
};
