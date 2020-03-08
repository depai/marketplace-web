import 'reflect-metadata';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { UserResolver } from './shop/services/user/user.resolver';
import { ProductResolver } from './shop/services/product/product.resolver';
import { ProductTelioResolver } from './shop/services/productTelio/productTelio.resolver';
import { PaymentResolver } from './shop/services/payment/payment.resolver';
import { OrderResolver } from './shop/services/order/order.resolver';
import { CouponResolver } from './shop/services/coupon/coupon.resolver';
import { CategoryResolver } from './shop/services/category/category.resolver';
import Connection from './shop/helpers/mongodb';
const app: express.Application = express();
const path = '/shop/graphql';
const PORT = process.env.PORT || 4000;
const main = async () => {
  console.log('connect to mongodb');
  Connection.connectDB('mongodb://localhost:27017/telio');
  const schema = await buildSchema({
    resolvers: [
      UserResolver,
      ProductResolver,
      PaymentResolver,
      OrderResolver,
      CouponResolver,
      CategoryResolver,
      // ProductTelioResolver
    ],
  });

  const apolloServer = new ApolloServer({
    schema,
    introspection: true,
    playground: true,
    tracing: true,
  });
  apolloServer.applyMiddleware({ app, path });

  // Connection.connectDB(config.dbConfig.url);

  app.listen(PORT, () => {
    console.log(`🚀 started http://localhost:${PORT}${path}`);
  });
};
main();
