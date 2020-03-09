import React from 'react';
import Head from 'next/head';
import {Modal} from '@redq/reuse-modal';
import BannerImg from "../image/Cloths.png";
import Banner from "../containers/BannerTelio/Banner";
import {
    ContentSection,
    MainContentArea,
    MobileCarouselDropdown,
    OfferSection,
    SidebarSection
} from "../styled/pages.style";
import Sidebar from "../containers/SidebarTelio/Sidebar";
import Products from "../containers/ProductsTelio/Products";
import {withApolloTelio} from "../helper/apolloTelio";
import StoreNav from "../components/StoreNav/StoreNav";
import storeType from "../constants/storeType";
import Carousel from "../components/Carousel/Carousel";
import OFFERS from "../data/offers";
import CartPopUp from "../containers/CartTelio/CartPopUp";

const products = ({ deviceType }) => {
    const targetRef = React.useRef(null);
    return (
        <>
            <Head>
                <title>Categories - PickBazar</title>
            </Head>
            <Modal>
                <Banner
                    intlTitleId='groceriesTitle'
                    intlDescriptionId='groceriesSubTitle'
                    imageUrl={BannerImg}
                />
                <MainContentArea>
                    <SidebarSection>
                        <Sidebar deviceType={deviceType} />
                    </SidebarSection>
                    <ContentSection>
                        <div ref={targetRef}>
                            <Products
                                deviceType={deviceType}
                                fetchLimit={16}
                            />
                        </div>
                    </ContentSection>
                </MainContentArea>
                <CartPopUp deviceType={deviceType} />
            </Modal>
        </>
    );
}

export default withApolloTelio(products)