const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const url = 'mongodb://localhost:27017/telio';
var ObjectId = require('mongoose').Types.ObjectId;

mongoose.connect(url, { useNewUrlParser: true });
mongoose.connection.once('open', () =>
  console.log(`Connected to mongo at ${url}`)
);

const typeDefs = gql`
  type User {
    id: ID
    name: String
  }
  type Category {
    _id: String
    title: String
  }
  type Image {
    id: ID
    url: String
  }

  type Product {
    _id: String
    name: String
    category: Category
  }
  type SpecialPrice {
    spPrice: String
    fromDate: String
    toDate: String
  }
  type Supplier {
    _id: String
    id: String
    name: String
    primarySupplier: String
    priorityNumber: Int
    sellingPrice: Int
  }
  type PaginatedProduct {
    docs: [Product]
    count: Int
    hasMore: Boolean
  }
  type PaginatedCategory {
    docs: [Category]
    count: Int
  }
  type Query {
    getUsers: [User]
    getProducts(
      keywords: String
      category: String
      offset: Int
      limit: Int
    ): PaginatedProduct
    getCategories(category: String, offset: Int, limit: Int): PaginatedCategory
    getDetailProduct(product_id: String): Product
    getDetailCategory(category: String): Category
  }
  type Mutation {
    addUser(userName: String!, email: String!): User
    createCategory(title: String!): Category
    createProduct(name: String!, category: String!): Product
  }
`;

const { Schema, SchemaTypes } = mongoose;

const userSchema = new Schema({
  userName: String,
  email: String,
});

const User = mongoose.model('user', userSchema);

const productSchema = new Schema(
  {
    name: { type: String, required: true },
    category: { type: Schema.Types.ObjectId, ref: 'category' },
  },
  { timestamps: true }
);

const Product = mongoose.model('product', productSchema);

const categorySchema = new Schema(
  {
    title: { type: String, required: true },
  },
  { timestamps: true }
);

const Category = mongoose.model('category', categorySchema);

const resolvers = {
  Query: {
    getUsers: async () => await User.find({}).exec(),
    getProducts: async (_, args) => {
      const items = await Product.find().populate('category');
      return { docs: items, count: await Product.count({}), hasMore: true };
    },
    getDetailProduct: async (_, args) => {
      return Product.findOne({ _id: new ObjectId(args.product_id) }).populate(
        'category'
      );
    },
    getCategories: async (_, args) => {
      const categories = await Category.find()
        .skip(args.offset)
        .limit(args.limit);
      const util = require('util');

      const count = await Category.count({});
      return { docs: categories, count: count };
    },
    getDetailCategory: async (_, args) => {
      const category = await Category.findOne({
        slug: args.slug,
      });
    },
  },
  Mutation: {
    addUser: async (_, args) => {
      try {
        let response = await User.create(args);
        return response;
      } catch (e) {
        return e.message;
      }
    },
    createCategory: async (_, args) => {
      try {
        let response = await Category.create(args);
        return response;
      } catch (e) {
        return e.message;
      }
    },
    createProduct: async (_, args) => {
      try {
        let response = await Product.create(args);
        return response;
      } catch (e) {
        return e.message;
      }
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });
const app = express();
// Add headers
app.use(function(req, res, next) {
  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8888');

  // Request methods you wish to allow
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, OPTIONS, PUT, PATCH, DELETE'
  );

  // Request headers you wish to allow
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-Requested-With,content-type'
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});
server.applyMiddleware({ app });

app.listen({ port: 4001 }, () =>
  console.log(`🚀 Server ready at http://localhost:4001${server.graphqlPath}`)
);
