import React, { useContext, useState, useEffect } from 'react';
import Link from 'next/link';
import Router from 'next/router';
import { openModal } from '@redq/reuse-modal';
import NavLink from 'components/NavLink/NavLink';
import Popover from 'components/Popover/Popover';
import SearchBox from 'components/SearchBox/SearchBox';
import { SearchContext } from 'contexts/search/search.context';
import { AuthContext } from 'contexts/auth/auth.context';
import AuthenticationForm from '../../SignInOutForm/Form';
import { FormattedMessage } from 'react-intl';
import Button from 'components/Button/Button';
import LanguageContext from 'contexts/language/language.context';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import {
  FruitsVegetable,
  MenuDown,
  FacialCare,
  DressIcon,
  Handbag,
  HelpIcon,
  BookIcon,
  FurnitureIcon,
  DEFlag,
  CNFlag,
  USFlag,
  ILFlag,
  VIFlag,
  ESFlag,
  SAFlag,
} from 'components/AllSvgIcon';
import HeaderWrapper, {
  HeaderLeftSide,
  HeaderRightSide,
  Logo,
  MainMenu,
  SelectedType,
  DropDownArrow,
  SelectedLang,
  LanguageItem,
  LangSwithcer,
  Flag,
  TypeIcon,
} from './Header.style';
import Logoimage from 'image/logo.svg';
import UserImage from 'image/user.jpg';
import {
  HOME_PAGE,
  GROCERY_PAGE,
  CLOTHING,
  MAKEUP_PAGE,
  BAGS_PAGE,
  FURNITURE_PAGE,
  BOOK_PAGE,
  PROCEED_TO_CHECKOUT_PAGE,
  PROFILE_PAGE,
  ORDER_RECEIVED,
  YOUR_ORDER,
  OFFER_PAGE,
  HELP_PAGE,
} from 'constants/navigation';

type HeaderProps = {
  style?: any;
  className?: string;
  token: string;
  pathname: string;
};

const MenuArray = [
  {
    link: GROCERY_PAGE,
    icon: <FruitsVegetable />,
    label: 'Grocery',
  },
  {
    link: MAKEUP_PAGE,
    label: 'Makeup',
    icon: <FacialCare />,
  },
  {
    link: BAGS_PAGE,
    label: 'Bags',
    icon: <Handbag />,
  },
  {
    link: CLOTHING,
    label: 'Clothing',
    icon: <DressIcon />,
  },
  {
    link: FURNITURE_PAGE,
    label: 'Furniture',
    icon: <FurnitureIcon width='15px' height='13px' />,
  },
  {
    link: BOOK_PAGE,
    label: 'Book',
    icon: <BookIcon width='15px' height='13px' />,
  },
];

const DropDownMenuArray = [
  {
    link: PROFILE_PAGE,
    label: 'Profile',
    intlId: 'navlinkProfile',
  },
  {
    link: PROCEED_TO_CHECKOUT_PAGE,
    label: 'Checkout',
    intlId: 'navlinkCheckout',
  },
  {
    link: YOUR_ORDER,
    label: 'Order',
    intlId: 'sidebarYourOrder',
  },
  {
    link: ORDER_RECEIVED,
    label: 'Order invoice',
    intlId: 'navlinkOrderReceived',
  },
];

const LanguageArray = [
  { id: 'ar', label: 'Arabic', intlLangName: 'intlArabic', icon: <SAFlag /> },
  { id: 'zh', label: 'Chinese', intlLangName: 'intlChinese', icon: <CNFlag /> },
  { id: 'en', label: 'English', intlLangName: 'intlEnglish', icon: <USFlag /> },
  { id: 'de', label: 'German', intlLangName: 'intlGerman', icon: <DEFlag /> },
  { id: 'he', label: 'Hebrew', intlLangName: 'intlHebrew', icon: <ILFlag /> },
  { id: 'es', label: 'Spanish', intlLangName: 'intlSpanish', icon: <ESFlag /> },
  { id: 'vi', label: 'Vietnam', intlLangName: 'intlVietnam', icon: <VIFlag /> },
];

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

const Header: React.FC<HeaderProps> = ({
  style,
  className,
  token,
  pathname,
}) => {
  const [categories, setCategories] = useState([]);
  const { data, loading } = useQuery(GET_CATEGORIES, {});
  useEffect(() => {
    if (data.getCategories) {
      setCategories(data.getCategories.docs);
    }
  }, []);
  const {
    state: { lang },
    toggleLanguage,
  } = useContext<any>(LanguageContext);
  // const activeMenuItem = categories.find(item => item.slug === pathname);
  const selectedLangindex = LanguageArray.findIndex(x => x.id === lang);

  const {
    authState: { isAuthenticated },
    authDispatch,
  } = useContext<any>(AuthContext);
  const { state, dispatch } = useContext(SearchContext);
  // const [activeMenu, setActiveMenu] = useState(activeMenuItem);
  const { text } = state;
  const handleSearch = (text: any) => {
    dispatch({
      type: 'UPDATE',
      payload: {
        ...state,
        text,
      },
    });
  };
  const { page, ...urlState } = state;
  const handleClickSearchButton = () => {
    Router.push({
      pathname: pathname === '/' ? '/grocery' : pathname,
      query: { ...urlState, text },
    });
  };
  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
      authDispatch({ type: 'SIGN_OUT' });
      Router.push('/');
    }
  };
  const resetSearch = (selectedMenu: any) => {
    // setActiveMenu(selectedMenu);
    dispatch({
      type: 'RESET',
    });
  };
  const NavItem = (item: any) => {
    return (
      <NavLink
        key={item.id}
        onClick={() => resetSearch(item)}
        className='menu-item'
        href={`category?slug_cate=`+item.slug}
        label={item.title}
        // icon={item.icon}
        iconClass='menu-item-icon'
      />
    );
  };

  const handleToggleLanguage = e => {
    toggleLanguage(e.target.value);
  };

  const LanguageMenu = (item: any) => {
    return (
      <LanguageItem
        onClick={handleToggleLanguage}
        key={item.id}
        value={item.id}
      >
        <span>{item.icon}</span>
        <FormattedMessage id={item.intlLangName} defaultMessage={item.label} />
      </LanguageItem>
    );
  };

  const signInOutForm = () => {
    authDispatch({
      type: 'SIGNIN',
    });

    openModal({
      show: true,
      overlayClassName: 'quick-view-overlay',
      closeOnClickOutside: true,
      component: AuthenticationForm,
      closeComponent: '',
      config: {
        enableResizing: false,
        disableDragging: true,
        className: 'quick-view-modal',
        width: 458,
        height: 'auto',
      },
    });
  };

  const isHomePage =
    pathname === HOME_PAGE ||
    pathname === GROCERY_PAGE ||
    pathname === CLOTHING ||
    pathname === MAKEUP_PAGE ||
    pathname === BOOK_PAGE ||
    pathname === FURNITURE_PAGE ||
    pathname === BAGS_PAGE;

  useEffect(() => {
    if (data.getCategories) {
      setCategories(data.getCategories.docs)
    }
  }, []);

  return (
    <HeaderWrapper style={style} className={className}>
      <HeaderLeftSide>
        <Logo
          onClick={() =>
            resetSearch({
              link: GROCERY_PAGE,
              icon: <FruitsVegetable />,
              label: 'Grocery',
            })
          }
        >
          <Link href={HOME_PAGE}>
            <a>
              <img src="/logo-hn_2.png" alt='pickbazar-admin' />
            </a>
          </Link>
        </Logo>
        <MainMenu>
          <Popover
            className='right'
            handler={
              <SelectedType>
                <span>
                  {/* <TypeIcon>{activeMenu.icon}</TypeIcon> */}
                  {/* <span>{activeMenu.slug}</span> */}
                  <span>Danh mục sản phẩm</span>
                </span>
                <DropDownArrow>
                  <MenuDown />
                </DropDownArrow>
              </SelectedType>
            }
            content={<>{categories.map(NavItem)}</>}
          />
        </MainMenu>
      </HeaderLeftSide>
      {isHomePage ? (
        <SearchBox
          className='headerSearch'
          handleSearch={(value: any) => handleSearch(value)}
          onClick={handleClickSearchButton}
          placeholder='Search anything...'
          hideType={true}
          minimal={true}
          showSvg={true}
          style={{ width: '100%' }}
          value={text || ''}
        />
      ) : null}
      <HeaderRightSide>
        {/* <NavLink
          className='menu-item'
          href={OFFER_PAGE}
          label='Offer'
          intlId='navlinkOffer'
        />
        <NavLink
          className='menu-item'
          href={HELP_PAGE}
          label='Need Help'
          intlId='navlinkHelp'
          iconClass='menu-icon'
          icon={<HelpIcon />}
        /> */}
        <LangSwithcer>
          <Popover
            className='right'
            handler={
              <SelectedLang>
                <Flag>{LanguageArray[selectedLangindex].icon}</Flag>
                <span>
                  <FormattedMessage
                    id={LanguageArray[selectedLangindex].intlLangName}
                    defaultMessage={LanguageArray[selectedLangindex].label}
                  />
                </span>
              </SelectedLang>
            }
            content={<>{LanguageArray.map(LanguageMenu)}</>}
          />
        </LangSwithcer>

        {!isAuthenticated ? (
          <Button
            onClick={signInOutForm}
            size='small'
            title='Login'
            style={{ fontSize: 15, color: '#fff' }}
            intlButtonId='joinButton'
          />
        ) : (
          <Popover
            direction='right'
            className='user-pages-dropdown'
            handler={<img src={UserImage} alt='user' />}
            content={
              <>
                {DropDownMenuArray.map((item, idx) => (
                  <NavLink
                    key={idx}
                    className='menu-item'
                    href={item.link}
                    label={item.label}
                    intlId={item.intlId}
                  />
                ))}
                <div className='menu-item' onClick={handleLogout}>
                  <a>
                    <span>
                      <FormattedMessage
                        id='navlinkLogout'
                        defaultMessage='Logout'
                      />
                    </span>
                  </a>
                </div>
              </>
            }
          />
        )}
      </HeaderRightSide>
    </HeaderWrapper>
  );
};

export default Header;
