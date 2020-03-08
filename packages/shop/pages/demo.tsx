import React from 'react';
import Head from 'next/head';
import { withApollo } from 'helper/apollo';
import ProductsDemo from 'containers/Products/ProductsDemo';
import CartPopUpDemo from 'containers/Cart/CardPopUpDemo';
import { openModal, Modal } from '@redq/reuse-modal';
import BannerImg from "../image/grocery.png";
import Banner from "../containers/Banner/Banner";

const PAGE_TYPE = 'grocery';

function Demo({ deviceType }) {
    return (
        <>
            <Head>
                <title>PickBazar</title>
            </Head>
            <Modal>
                <Banner
                    intlTitleId='groceriesTitle'
                    intlDescriptionId='groceriesSubTitle'
                    imageUrl={BannerImg}
                />
                <ProductsDemo
                    type={PAGE_TYPE}
                    deviceType={deviceType}
                    fetchLimit={16}
                />
                <CartPopUpDemo deviceType={deviceType} />
            </Modal>
        </>
    );
}

export default withApollo(Demo);
