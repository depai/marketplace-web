const express               = require('express');
const { ApolloServer, gql } = require('apollo-server-express');

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const url = 'mongodb://localhost:27017/telio';
var ObjectId = require('mongoose').Types.ObjectId;

mongoose.connect(url, { useNewUrlParser: true });
mongoose.connection.once('open', () => console.log(`Connected to mongo at ${url}`));

const typeDefs = gql`
    type User {
        id: ID!
        userName: String
        email: String
    }
    type Category {
        title: String
        slug: String
        type: String
        icon: String
        children: [Category]
    }
    type Product {
        name: String
        reference_id: String
        EAN: String
        SKU: String
        image: String
        brand:String
        status: String
        variants: [String]
        categories: [Category]
        price: Int
        suggestedPurchasePrice: Int
        specialPrice: [String]
        city: String
        parentSKU: String
        suppliers: [String]
        createdBy: String
        updatedBy: String
        createdAt: String
        updatedAt: String
    }
    type PaginatedProduct {
        docs: [Product]
        count: Int
    }
    type PaginatedCategory {
        docs: [Category]
        count: Int
    }
    type Query {
        getUsers: [User]
        getProducts(keywords: String,offset: Int, limit: Int): PaginatedProduct
        getCategories(category_id: String, offset: Int, limit: Int): PaginatedCategory
        getDetailProduct(product_id: String): Product
        getDetailCategory(category_id: String): Category
    }
    type Mutation {
        addUser(userName: String!, email: String!): User
    }
`;


const { Schema,SchemaTypes } = mongoose;

const userSchema = new Schema({
    userName: String,
    email: String
});

const User = mongoose.model('user', userSchema);


const productSchema = new Schema(
    {
        name: { type: String, required: true },
        reference_id: { type: String, required: true, index: { unique: true } },
        EAN: { type: String },
        SKU: { type: String, required: true, index: { unique: true } },
        image: { type: String },
        city: { type: String },
        status: { type: String },
        variants: [{ type: String }],
        categories: [{ type: String }],
        price: { type: Number },
        brand: { type: String },
        suggestedPurchasePrice: { type: Number },
        specialPrice: {
            spPrice: { type: Number },
            fromDate: { type: String },
            toDate: { type: String },
        },
        parentSKU: { type: String },
        suppliers: [
            {
                _id: false,
                id: { type: SchemaTypes.ObjectId, required: true },
                name: { type: String, required: true },
                primarySupplier: { type: Boolean },
                priorityNumber: { type: Number },
                sellingPrice: { type: SchemaTypes.Decimal128 },
            },
        ],
        createdBy: {
            name: { type: String },
            id: { type: String },
        },
        updatedBy: {
            name: { type: String },
            id: { type: String },
        },
        createdAt: {
            type: Date,
        },
        updatedAt: {
            type: Date,
        },
    },
    { timestamps: true },
)

const Product = mongoose.model('products', productSchema);

const categorySchema = new Schema(
    {
        title: { type: String, required: true },
        slug: { type: String, required: true, index: { unique: true } },
        type: { type: String },
        icon: { type: String, required: true, index: { unique: true } },
        children: { type: Schema.Types.Mixed }
    },
    { timestamps: true },
)

const Category = mongoose.model('categories', categorySchema);


const resolvers = {
    Query: {
        getUsers: async () => await User.find({}).exec(),
        getProducts: async (_, args) => {
            const items = await Product.find({name:args.name}).skip(args.offset).limit(args.limit);
            return {docs:items,count:await Product.count({})}
            },
        getDetailProduct: async (_, args) => {return Product.findOne({_id: new ObjectId(args.product_id)})},
        getCategories: async (_,args) =>{
            const categories = await Category.find().skip(args.offset).limit(args.limit);
            const count = await Category.count({});
            return {docs: categories, count: count}
        },
        getDetailCategory: async (_,args)=>{
            const category = await Category.findOne({_id: new ObjectId(args.category_id)});
        }

    },
    Mutation: {
        addUser: async (_, args) => {
            try {
                let response = await User.create(args);
                return response;
            } catch(e) {
                return e.message;
            }
        }
    }
};


const server = new ApolloServer({ typeDefs, resolvers });
const app = express();
server.applyMiddleware({ app });

app.listen({ port: 4000 }, () =>
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`));