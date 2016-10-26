/**
 * Définition d'un modèle user.
 */

module.exports = (database, types) => {
  return database.define('user', {
    username: {
      type: types.STRING,
      unique: true,
      allowNull: false,
      validate: {
        min: 1,
        max: 30,
        is: ['^[a-z0-9]+$','i']
      }
    },
    first_name: {
      type: types.STRING
    },
    last_name: {
      type: types.STRING
    },
    password: {
      type: types.STRING,
      allowNull: false
    },
    email: {
      type: types.STRING,
      allowNull: false,
      validate: {
        isEmail: true
      }
    },
    biography: {
      type: types.TEXT,
      validate: {
        max: 400
      }
    }
  }, {
    underscored: true,
    classMethods: {
        associate: models => {
          models.user.belongsToMany(models.user, {
            as: 'followers',
            through: 'users__following'
          });
          models.user.hasMany(models.tweet, {
            onDelete: 'cascade'
          });
        }
    },
    hooks: {
      beforeDestroy: (user) => {
        database.models.tweet.destroy({
          where: {
            user_id: user.id
          }
        })
      }
    }
  });
  };

  /**
   * supression des tout les tweet associés à un user
   */
