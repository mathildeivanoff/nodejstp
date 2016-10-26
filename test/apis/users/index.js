/**
 * Déclaration des modules
 */

const models = require('../../database');
const passwordEncripted = require('password-hash');

/**
 * afficher les users
 */

exports.register = function (server, options, next) {
  server.route({
     method: 'GET',
     path: '/users',
     handler: (request, reply) => {
       models.user.findAll()
       .then(result => {
           return reply(result);
       })
       .catch(err => {
         return reply({
           error:err.message
         })
       })
     }
   }),

   /**
    * afficher un user
    */

   server.route({
      method: 'GET',
      path: '/users/{id}',
      handler: (request, reply) => {
        const data =
          request.payload ||
          request.params ||
          request.body;
        models.user.findById(data.id)
        .then(result => {
            return reply(result);
        })
        .catch(err => {
          return reply({
            error:err.message
          })
        })
      }
    }),

    /**
     * afficher les following
     */

    server.route({
    method: 'GET',
    path: '/users/{user_id}/following',
    handler: (request, reply) => {
      const data =
        request.payload ||
        request.params ||
        request.body;

      models.user.find({where:{
          id: request.params.user_id
        },include:[{
          model: models.user,
          as: 'followers'
        }]
      })
      .then(result => {
          return reply(result);
      })
      .catch(err => {
        return reply({
          error:err.message
        })
      })
    }
  }),

  /**
   * afficher les followers
   */

  server.route({
    method: 'GET',
    path: '/users/{user_id}/followers',
    handler: (request, reply) => {
      const data =
        request.payload ||
        request.params ||
        request.body;

        models.user.find({where:{
            id: request.params.user_id
          },include:[{
            model: models.user,
            as: 'followers'
          }]
        })
      .then(result => {
          return reply(result);
      })
      .catch(err => {
        return reply({
          error:err.message
        })
      })
    }
  }),

    /**
     * créer un user
     */

    server.route({
      method: 'POST',
      path: '/users',
      handler: (request, reply) => {
        const data =
          request.payload ||
          request.params ||
          request.body;

          var hashedPassword = passwordHash.generate(data.password);

          models.user.create(data)
            .then(result => {
              return reply(result)
            })
            .catch(err => {
              return reply ({
                error: err.message
              })
            })
      }
    });

    /**
     * permet un user d'en follo un autre
     */

     server.route({
          method: 'PUT',
          path:'/users/{user_id}/following/{following_id}',
          handler:  (request, reply) => {
            console.log(models.user);
            console.log(models.user);

            models.user.update({user_id: request.params.following_id}, {
              where: {
                id: request.params.user_id
              }, include: [{
                      model: [models.user],
                      as: 'followers'
              }]
            })
              .then(result => {
                return reply(result)
              })
              .catch(err => {
                return reply({
                  error:err.message
                })
              })
          }
      }),

      /**
       * modifier un user
       */

    server.route({
      method: 'PUT',
      path: '/users/{id}',
      handler: (request, reply) => {
          models.user.update(request.payload, {
            where: {
              id: request.params.id
            }
          })
            .then(result => {
              return reply(result)
            })
            .catch(err => {
              return reply ({
                error: err.message
              })
            })
      }
    });

    /**
     * supression des users
     */

    server.route({
      method: 'DELETE',
      path: '/users/{id}',
      handler: (request, reply) => {
          models.user.destroy({
            where: {
              id: request.params.id
            }
          })
            .then(result => {
              return reply(result)
            })
            .catch(err => {
              return reply ({
                error: err.message
              })
            })
      }
    });

    next();
  };

exports.register.attributes = {
  name: 'users'
};
