const { User } = require('../models');
const { signToken, AuthenticationError } = require('../utils/auth');

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        const userData = await User.findOne({ _id: context.user._id })
          .select('-__v -password');

        return userData;
      }

      throw AuthenticationError;
    },
  },
  Mutation: {
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

        if (!user) {
            throw AuthenticationError;
        }
      
        const correctPw = await user.isCorrectPassword(password);

        if (!correctPw) {
            throw AuthenticationError;
        }

        const token = signToken(user);
        return { token, user };
  },
    addUser: async (parent, args) => {
        const user = await User.create(args);
        const token = signToken(user);
    
        return { token, user };
    },
    saveBook: async (parent, { bookToSave }, context) => {
        if (context.user) {
          const updatedBooks = await User.findOneAndUpdate(
            { _id: context.user._id },
            { $addToSet: { savedBooks: bookToSave } },
            { new: true, runValidators: true}
          );

            return updatedBooks;
        }

        throw AuthenticationError;
    },
    removeBook: async (parent, { bookId }, context) => {
        if (context.user) {
          const updatedBooks = await User.findOneAndUpdate(
            { _id: context.user._id },
            { $pull: { savedBooks: { bookId: bookId } } },
            { new: true }
          );

            return updatedBooks;
        }

        throw AuthenticationError;
    },
    },
};

module.exports = resolvers;
