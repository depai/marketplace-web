import React from 'react';
import Head from 'next/head';
import {withApolloTelio} from "helper/apolloTelio";
import {Modal} from '@redq/reuse-modal';
import BannerImg from "../image/Cloths.png";
import Banner from "../containers/Banner/Banner";

const categories = (props) => {
    return (
        <>
            <Head>
                <title>Categories - PickBazar</title>
            </Head>
            <Modal>
                <Banner
                    intlTitleId='womenClothsTitle'
                    intlDescriptionId='womenClothsSubTitle'
                    imageUrl={BannerImg}
                />
            </Modal>
        </>
    );
}

export default withApolloTelio(categories)