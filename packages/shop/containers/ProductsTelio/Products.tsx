import React, { useState } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import gql from 'graphql-tag';
import { openModal, closeModal } from '@redq/reuse-modal';
import ProductCard from 'components/ProductCardTelio/ProductCard';
import {
  ProductsRow,
  ProductsCol,
  ButtonWrapper,
  LoaderWrapper,
  LoaderItem,
  ProductCardWrapper,
} from './Products.style';
import { CURRENCY } from 'helper/constant';
import { useQuery } from '@apollo/react-hooks';
import Button from 'components/Button/Button';
import Loader from 'components/Loader/Loader';
import Placeholder from 'components/Placeholder/Placeholder';
import Fade from 'react-reveal/Fade';
import NoResultFound from 'components/NoResult/NoResult';

const QuickView = dynamic(() => import('../QuickViewTelio/QuickView'));

const GET_PRODUCTS = gql`
  query getProducts(
    $keywords: String
    $category: String
    $offset: Int
    $limit: Int
  ) {
    getProducts(
      keywords: $keywords
      category: $category
      offset: $offset
      limit: $limit
    ) {
      docs {
        _id
        name
        reference_id
        EAN
        SKU
        image
        description
        city
        status
        quantity
        variants
        categories {
          title
          slug
        }
        price
        brand
        gallery{
          url
        }
        suggestedPurchasePrice
        specialPrice {
            spPrice
            fromDate
            toDate
        }
        parentSKU
        suppliers {
                _id
                id
                name
                primarySupplier
                priorityNumber
                sellingPrice
            }
        createdBy {
            name
            id
        }
        updatedBy {
            name
            id
        }
        createdAt
        updatedAt
      }
      count
      hasMore
    }
  }
`;

type ProductsProps = {
  deviceType?: {
    mobile: boolean;
    tablet: boolean;
    desktop: boolean;
  };
  fetchLimit?: number;
  loadMore?: boolean;
  type?: string;
};
export const Products: React.FC<ProductsProps> = ({
  deviceType,
  fetchLimit = 8,
  loadMore = true,
  type = '',
}) => {
  const router = useRouter();
  const [loadingMore, toggleLoading] = useState(false);
  const { data, error, loading, fetchMore } = useQuery(GET_PRODUCTS, {
    variables: {
      keywords: router.query.text,
      category: router.query.slug_cate,
      offset: 0,
      limit: fetchLimit,
    },
  });

  // Quick View Modal
  const handleModalClose = () => {
    const href = `${router.pathname}`;
    const as = '/';
    router.push(href, as, { shallow: true });
    closeModal();
  };
  const handleQuickViewModal = React.useCallback(
    (modalProps: any, deviceType: any, onModalClose: any) => {
      if (router.pathname === '/detail/[slug]') {
        const as = `/detail/${modalProps._id}`;
        router.push(router.pathname, as);
        return;
      }
      openModal({
        show: true,
        overlayClassName: 'quick-view-overlay',
        closeOnClickOutside: false,
        component: QuickView,
        componentProps: { modalProps, deviceType, onModalClose },
        closeComponent: 'div',
        config: {
          enableResizing: false,
          disableDragging: true,
          className: 'quick-view-modal',
          width: 900,
          y: 30,
          height: 'auto',
          transition: {
            mass: 1,
            tension: 0,
            friction: 0,
          },
        },
      });
      const href = `${router.pathname}?${modalProps._id}`;
      const as = `/detail/${modalProps._id}`;
      router.push(href, as, { shallow: true });
    },
    []
  );

  if (loading) {
    return (
      <LoaderWrapper>
        <LoaderItem>
          <Placeholder />
        </LoaderItem>
        <LoaderItem>
          <Placeholder />
        </LoaderItem>
        <LoaderItem>
          <Placeholder />
        </LoaderItem>
      </LoaderWrapper>
    );
  }

  if (error) return <div>{error.message}</div>;
  if (!data || !data.getProducts || data.getProducts.docs.length === 0) {
    return <NoResultFound />;
  }
  const handleLoadMore = () => {
    toggleLoading(true);
    fetchMore({
      variables: {
        offset: Number(data.products.items.length),
        limit: fetchLimit,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        toggleLoading(false);
        if (!fetchMoreResult) {
          return prev;
        }
        return {
          products: {
            __typename: prev.products.__typename,
            items: [...prev.products.items, ...fetchMoreResult.products.items],
            hasMore: fetchMoreResult.products.hasMore,
          },
        };
      },
    });
  };
  return (
    <>
      <ProductsRow>
        {data.getProducts.docs.map((item: any, index: number) => (
          <ProductsCol key={index}>
            <ProductCardWrapper>
              <Fade
                duration={800}
                delay={index * 10}
                style={{ height: '100%' }}
              >
                <ProductCard
                  title={item.name}
                  description={item.description}
                  image={item.image}
                  quantityWarehouse={item.quantity}
                  currency={CURRENCY}
                  price={item.price}
                  salePrice={item.specialPrice.spPrice}
                  discountInPercent={item.specialPrice? (1-(item.specialPrice.spPrice / item.price ))*100 : 0}
                  data={item}
                  deviceType={deviceType}
                  onClick={() =>
                    handleQuickViewModal(item, deviceType, handleModalClose)
                  }
                />

              </Fade>
            </ProductCardWrapper>
          </ProductsCol>
        ))}
      </ProductsRow>
      {loadMore && data.getProducts.hasMore && (
        <ButtonWrapper>
          <Button
            onClick={handleLoadMore}
            title='Xem thêm'
            intlButtonId='loadMoreBtn'
            size='small'
            isLoading={loadingMore}
            loader={<Loader color='#009E7F' />}
            style={{
              minWidth: 135,
              backgroundColor: '#ffffff',
              border: '1px solid #f1f1f1',
              color: '#009E7F',
            }}
          />
        </ButtonWrapper>
      )}
    </>
  );
};
export default Products;
