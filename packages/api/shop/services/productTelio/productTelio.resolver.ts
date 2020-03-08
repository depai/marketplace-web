import { Resolver, Query, Arg, Int, ObjectType } from 'type-graphql';
import ProductModel from './productTelio.model';
import Product, { ProductResponse } from './productTelio.type';

@Resolver()
export class ProductTelioResolver {

  @Query({ description: 'Get all the products' })
   async productsTelio(
    @Arg('limit', type => Int, { defaultValue: 10 }) limit: number,
    @Arg('offset', type => Int, { defaultValue: 0 }) offset: number,
    @Arg('type', { nullable: true }) type?: string,
    @Arg('text', { nullable: true }) text?: string,
    @Arg('category', { nullable: true }) category?: string
  ) {
    const total = await ProductModel.count({});
    const items = await ProductModel.paginate({limit:limit,offset:offset});
    // console.error(items);
    return {
      total: total,
      products: items,
    }
  }
}
