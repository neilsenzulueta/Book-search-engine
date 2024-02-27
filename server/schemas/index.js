// Import all schema files
const resolvers = require('./resolvers');
const typeDefs = require('./typeDefs');

// Export all schemas as an object
module.exports = {
  resolvers,
  typeDefs,
};
