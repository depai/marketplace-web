import React, { FunctionComponent } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import Sticky from 'react-stickynode';
import styled from 'styled-components';

import Header from './Header/Header';
import { useStickyState } from 'contexts/app/app.provider';
import {
  HOME_PAGE,
  GROCERY_PAGE,
  CLOTHING,
  MAKEUP_PAGE,
  BAGS_PAGE,
  FURNITURE_PAGE,
  BOOK_PAGE,
} from 'constants/navigation';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import {withApolloTelio} from "../../helper/apolloTelio";
const MobileHeader = dynamic(() => import('./Header/MobileHeader'), {
  ssr: false,
});
const LayoutWrapper = styled.div`
  background-color: #f7f7f7;

  .reuseModalHolder {
    padding: 0;
    overflow: auto;
    border-radius: 3px 3px 0 0;
    border: 0;
  }
`;

type LayoutProps = {
  className?: string;
  deviceType: {
    mobile: boolean;
    tablet: boolean;
    desktop: boolean;
  };
  token?: string;
};

const GET_CATEGORIES = gql`
  query getCategories($category: String) {
    getCategories(category: $category) {
      docs {
        id
        title
        slug
        icon
        children {
          id
          title
          slug
        }
      }
    }
  }
`;

const Layout: FunctionComponent<LayoutProps> = ({
  className,
  children,
  deviceType: { mobile, tablet, desktop },
  token,
}) => {
  const isSticky = useStickyState('isSticky');
  const { pathname } = useRouter();

  const isHomePage =
    pathname === HOME_PAGE ||
    pathname === GROCERY_PAGE ||
    pathname === CLOTHING ||
    pathname === MAKEUP_PAGE ||
    pathname === BOOK_PAGE ||
    pathname === FURNITURE_PAGE ||
    pathname === BAGS_PAGE;

  const { data, loading } = useQuery(GET_CATEGORIES, {});

  return (
    <LayoutWrapper className={`layoutWrapper ${className}`}>
      {(mobile || tablet) && (
        <Sticky enabled={isSticky} innerZ={1001}>
          <MobileHeader
            className={`${isSticky ? 'sticky' : 'unSticky'} ${
              isHomePage ? 'home' : ''
            }`}
            pathname={pathname}
          />
        </Sticky>
      )}

      {desktop && (
        <Sticky enabled={isSticky} innerZ={1001}>
          <MobileHeader
            className={`${isSticky ? 'sticky' : 'unSticky'} ${
              isHomePage ? 'home' : ''
            } desktop`}
            pathname={pathname}
          />
          <Header
            className={`${isSticky ? 'sticky' : 'unSticky'} ${
              isHomePage ? 'home' : ''
            }`}
            token={token}
            pathname={pathname}
          />
        </Sticky>
      )}
      {children}
    </LayoutWrapper>
  );
};

export default withApolloTelio(Layout);
