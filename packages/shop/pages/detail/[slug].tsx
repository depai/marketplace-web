import React from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useQuery } from '@apollo/react-hooks';
import ProductDetails from 'containers/ProductDetailsTelio/ProductDetails';
import ProductDetailsBook from 'containers/ProductDetailsBook/ProductDetailsBook';
import { Modal } from '@redq/reuse-modal';
import ProductSingleWrapper, {
  ProductSingleContainer,
} from 'styled/product-single.style';
import CartPopUp from 'containers/CartTelio/CartPopUp';
import { GET_PRODUCT_TELIO_DETAILS } from 'graphql/query/product.query';
import {withApolloTelio} from "../../helper/apolloTelio";

type Props = {
  deviceType?: {
    mobile: boolean;
    tablet: boolean;
    desktop: boolean;
  };
};

const ProductPage: NextPage<Props> = ({ deviceType }) => {
  const {
    query: { slug },
  } = useRouter();
  const { data, error, loading } = useQuery(GET_PRODUCT_TELIO_DETAILS, {
    variables: { product_id:slug },
  });

  if (loading) {
    return <div>loading...</div>;
  }

  if (error) return <div>Error: {error.message}</div>;

  let content;
  content = (
      <ProductDetails product={data.getDetailProduct} deviceType={deviceType} />
  );

  return (
    <>
      <Head>
        <title>{data.name} - PickBazar</title>
      </Head>
      <Modal>
        <ProductSingleWrapper>
          <ProductSingleContainer>
            {content}
            <CartPopUp deviceType={deviceType} />
          </ProductSingleContainer>
        </ProductSingleWrapper>
      </Modal>
    </>
  );
};
export default withApolloTelio(ProductPage);
