import React from 'react';
import Head from 'next/head';
import {withApollo} from "helper/apollo";
import {Modal} from '@redq/reuse-modal';
import BannerImg from "../image/Cloths.png";
import Banner from "../containers/Banner/Banner";
import {ContentSection, MainContentArea, SidebarSection} from "../styled/pages.style";
import Sidebar from "../containers/Sidebar/Sidebar";
import Products from "../containers/ProductsTelio/Products";
import {withApolloTelio} from "../helper/apolloTelio";

const PAGE_TYPE = 'grocery';

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
                    <ContentSection>
                        <div ref={targetRef}>
                            <Products
                                type={PAGE_TYPE}
                                deviceType={deviceType}
                                fetchLimit={16}
                            />
                        </div>
                    </ContentSection>
                </MainContentArea>
            </Modal>
        </>
    );
}

export default withApolloTelio(products)