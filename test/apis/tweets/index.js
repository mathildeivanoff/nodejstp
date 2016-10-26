/**
 * Module dependencies.
 */

const models = require('../../database');

/**
 * Export the tweet API with its own routes.
 */

 /**
  * Pour afficher les tweets
  */
exports.register = function (server, options, next) {
  server.route({
     method: 'GET',
     path: '/tweets',
     handler: (request, reply) => {
       models.tweet.findAll()
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
    * afficher les tweets associé à un user
    */

   server.route({
    method: 'GET',
    path: '/users/{id}/tweets',
    handler: (request, reply) => {
      models.tweet.findAll({
        where: {
          user_id: request.params.id
        }
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
   * afficher un tweet
   */

   server.route({
      method: 'GET',
      path: '/tweets/{id}',
      handler: (request, reply) => {
        const data =
          request.payload ||
          request.params ||
          request.body;
        models.tweet.findById(data.id)
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
     * créer un tweet
     */
    server.route({
      method: 'POST',
      path: '/tweets',
      handler: (request, reply) => {
        const data =
          request.payload ||
          request.params ||
          request.body;

          models.tweet.create(data)
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
     * modifier un tweet
     */

    server.route({
      method: 'PUT',
      path: '/tweets/{id}',
      handler: (request, reply) => {
          models.tweet.update(request.payload, {
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
     * supression des tweets
     */
     
    server.route({
      method: 'DELETE',
      path: '/tweets/{id}',
      handler: (request, reply) => {
          models.tweet.destroy({
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
  name: 'tweets'
};
