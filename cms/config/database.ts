import path from 'path';

function getConnection(env: any, client: string) {
  const connections = {
    mysql: {
      connection: {
        host: env('DATABASE_HOST', 'localhost'),
        port: env.int('DATABASE_PORT', 3306),
        database: env('DATABASE_NAME', 'strapi'),
        user: env('DATABASE_USERNAME', 'strapi'),
        password: env('DATABASE_PASSWORD', 'strapi'),
      },
    },
    postgres: {
      connection: {
        host: env('DATABASE_HOST', 'localhost'),
        port: env.int('DATABASE_PORT', 5432),
        database: env('DATABASE_NAME', 'strapi'),
        user: env('DATABASE_USERNAME', 'strapi'),
        password: env('DATABASE_PASSWORD', 'strapi'),
      },
    },
    sqlite: {
      connection: {
        filename: path.join(__dirname, '..', '..', env('DATABASE_FILENAME', '.tmp/data.db')),
      },
    },
  };
  return connections[client];
}

export default ({ env }) => {
  const client = env('DATABASE_CLIENT', 'sqlite');
  const connection = getConnection(env, client);

  return {
    connection: {
      client,
      ...connection,
      acquireConnectionTimeout: env.int('DATABASE_CONNECTION_TIMEOUT', 60000),
    },
  };
};

module.exports = ({ env }) => {
  const client = env('DATABASE_CLIENT', 'sqlite');
  const connection = getConnection(env, client);

  return {
    connection: {
      client,
      ...connection,
      useNullAsDefault: true,
    },
  };
};
