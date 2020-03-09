import React from 'react';
import Head from 'next/head';
import {withApolloTelio} from "helper/apolloTelio";
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
import StoreNav from "../components/StoreNav/StoreNav";
import storeType from "../constants/storeType";
import Sidebar from "../containers/SidebarTelio/Sidebar";
import Carousel from "../components/Carousel/Carousel";
import OFFERS from "../data/offers";
import Products from "../containers/ProductsTelio/Products";
import {useRouter} from "next/router";
import CartPopUp from "../containers/CartTelio/CartPopUp";

const categories = ({ deviceType }) => {
    const { query } = useRouter();
    const targetRef = React.useRef(null);
    React.useEffect(() => {
        if ((query.text || query.category) && targetRef.current) {
            window.scrollTo({
                top: targetRef.current.offsetTop - 110,
                behavior: 'smooth',
            });
        }
    }, [query]);
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

export default withApolloTelio(categories)