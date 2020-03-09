import React, { useContext } from "react";
import { useRouter } from "next/router";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import Sticky from "react-stickynode";
import { Scrollbars } from "react-custom-scrollbars";
import Popover from "components/Popover/Popover";
import CategoryDropdown from "components/CategoryDropdown/SpringDropdown";
import { ArrowDropDown, CategoryIcon } from "components/AllSvgIcon";
import { SearchContext } from "contexts/search/search.context";
import { useStickyState } from "contexts/app/app.provider";
import {
  SidebarMobileLoader,
  SidebarLoader
} from "components/Placeholder/Placeholder";

import {
  CategoryWrapper,
  PopoverHandler,
  PopoverWrapper,
  SidebarWrapper,
  Loading
} from "./Sidebar.style";
import {
  Accessories,
  BathOil,
  BeautyHealth,
  Beverage,
  Breakfast,
  Cooking,
  Dairy,
  Deodorent,
  Eyes,
  Face,
  FacialCare,
  FruitsVegetable,
  HandBags,
  HomeCleaning,
  LaptopBags,
  Lips,
  MeatFish,
  OralCare,
  OuterWear,
  Pants,
  PetCare,
  Purse,
  ShavingNeeds,
  Shirts,
  ShoulderBags,
  Skirts,
  Snacks,
  Tops,
  Wallet,
  WomenDress
} from "components/AllSvgIcon";

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

let iconTypes = {
  Accessories: Accessories,
  BathOil: BathOil,
  BeautyHealth: BeautyHealth,
  Beverage: Beverage,
  Breakfast: Breakfast,
  Cooking: Cooking,
  Dairy: Dairy,
  Deodorent: Deodorent,
  Eyes: Eyes,
  Face: Face,
  FacialCare: FacialCare,
  FruitsVegetable: FruitsVegetable,
  HandBags: HandBags,
  HomeCleaning: HomeCleaning,
  LaptopBags: LaptopBags,
  Lips: Lips,
  MeatFish: MeatFish,
  OralCare: OralCare,
  OuterWear: OuterWear,
  Pants: Pants,
  PetCare: PetCare,
  Purse: Purse,
  ShavingNeeds: ShavingNeeds,
  Shirts: Shirts,
  ShoulderBags: ShoulderBags,
  Skirts: Skirts,
  Snacks: Snacks,
  Tops: Tops,
  Wallet: Wallet,
  WomenDress: WomenDress
};

type SidebarCategoryProps = {
  deviceType: {
    mobile: string;
    tablet: string;
    desktop: boolean;
  };
};

const SidebarCategory: React.FC<SidebarCategoryProps> = ({
  deviceType: { mobile, tablet, desktop }
}) => {
  const { state, dispatch } = useContext(SearchContext);
  const router = useRouter();
  const { pathname } = router;
  const { data, loading } = useQuery(GET_CATEGORIES, {});
  const selectedQueries =
    state && state.slug_cate && state.slug_cate.split(",");
  const handleCategorySelection = (slug: string) => {
    dispatch({
      type: "UPDATE",
      payload: {
        ...state,
        page: 1,
        slug_cate: `${slug}`
      }
    });
    const { page, ...urlState } = state;
    router.push(
      {
        pathname: "/categories",
        query: { ...urlState, slug_cate: slug }
      },
      {
        pathname: "/categories",
        query: { ...urlState, slug_cate: slug }
      },
      { shallow: true }
    );
  };
  const isSidebarSticky = useStickyState("isSidebarSticky");

  if (!data || loading) {
    if (mobile || tablet) {
      return <SidebarMobileLoader />;
    }

    return <SidebarLoader />;
  }
  return (
    <CategoryWrapper>
      {(mobile || tablet) && (
        <Popover
          handler={
            <PopoverHandler>
              <div>
                <CategoryIcon />
                Select your Category
              </div>
              <div>
                <ArrowDropDown />
              </div>
            </PopoverHandler>
          }
          className="category-popover"
          content={
            <>
              <CategoryDropdown
                items={data.getCategories.docs}
                iconList={iconTypes}
                handleCategorySelection={(slug: any) =>
                  handleCategorySelection(slug)
                }
                selectedQueries={selectedQueries}
              />
            </>
          }
        />
      )}
      {desktop && (
        <>
          <PopoverWrapper>
            <Popover
              handler={
                <PopoverHandler>
                  <div>
                    <CategoryIcon />
                    Select your Category
                  </div>
                  <div>
                    <ArrowDropDown />
                  </div>
                </PopoverHandler>
              }
              className="category-popover"
              content={
                <>
                  <CategoryDropdown
                    items={data.getCategories.docs}
                    iconList={iconTypes}
                    handleCategorySelection={(slug: any) =>
                      handleCategorySelection(slug)
                    }
                    selectedQueries={selectedQueries}
                  />
                </>
              }
            />
          </PopoverWrapper>

          <SidebarWrapper>
            <Sticky enabled={isSidebarSticky} top={110}>
              <Scrollbars universal autoHide autoHeight autoHeightMax={688}>
                <CategoryDropdown
                  items={data.getCategories.docs}
                  iconList={iconTypes}
                  handleCategorySelection={(id: any) =>
                    handleCategorySelection(id)
                  }
                  selectedQueries={selectedQueries}
                />
              </Scrollbars>
            </Sticky>
          </SidebarWrapper>
        </>
      )}
    </CategoryWrapper>
  );
};

export default SidebarCategory;
