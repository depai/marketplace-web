import React from 'react';
import { CartContext } from 'contexts/cart/cart.context';
import { FormattedMessage } from 'react-intl';
import Image from 'components/Image/Image';
import Button from '../Button/Button';
import InputIncDec from '../InputIncDec/InputIncDec';
import { CartIcon } from '../AllSvgIcon';
import {
  ProductCardWrapper,
  ProductImageWrapper,
  ProductInfo,
  SaleTag,
  DiscountPercent,
} from './ProductCard.style';
import { getProductQuantity, findProductIndex } from '../helpers/utility';

type ProductCardProps = {
  title: string;
  image: any;
  quantityWarehouse: number;
  currency: string;
  description: string;
  price: number;
  salePrice?: number;
  discountInPercent?: number;
  data: any;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void;
  increment?: (e: any) => void;
  decrement?: (e: any) => void;
  cartProducts?: any;
  addToCart?: any;
  updateCart?: any;
  value?: any;
  deviceType?: any;
};

const ProductCard: React.FC<ProductCardProps> = ({
                                                   title,
                                                   image,
                                                   quantityWarehouse,
                                                   price,
                                                   salePrice,
                                                   discountInPercent,
                                                   cartProducts,
                                                   addToCart,
                                                   updateCart,
                                                   value,
                                                   currency,
                                                   onChange,
                                                   increment,
                                                   decrement,
                                                   data,
                                                   deviceType,
                                                   onClick,
                                                   ...props
                                                 }) => {
  const { add, update, products } = React.useContext(CartContext);
  const index = data && data._id ? findProductIndex(products, data._id) : -1;
  const quantity = getProductQuantity(products, index);

  const handleClick = (e: any) => {
    e.stopPropagation();
    add(e, data);
  };

  const handleUpdate = (value: number, e: any) => {
    if (index === -1 && value === 1) {
      add(e, data);
    } else {
      update(data._id, value);
    }
  };
  return (
      <ProductCardWrapper onClick={onClick} className='product-card'>
        <ProductImageWrapper>
          <Image
              url={image}
              className='product-image'
              style={{ position: 'relative' }}
              alt={title}
          />
        </ProductImageWrapper>
        <ProductInfo>
          <h3 className='product-title'>{title}</h3>
          <span className='product-weight'>Còn {quantityWarehouse} sản phẩm</span>
          <div className='product-meta'>
            <div className='productPriceWrapper'>
              <span className='product-price-demo'>
                  {salePrice ? salePrice.toLocaleString('vi-VN', { style: 'currency', currency: 'vnd' }) : price.toLocaleString('vi-VN', { style: 'currency', currency: 'vnd' })}
                  {' '}{currency}
                  {discountInPercent ? (
                      <span className={'product-discount'}> -{discountInPercent.toPrecision(2)}%</span>
                  ) : (
                      ''
                  )}
              </span>
              {discountInPercent ? (
                  <span className='discountedPriceDemo'>
                {price.toLocaleString('vi-VN', { style: 'currency', currency: 'vnd' })}
              </span>
              ) : (
                  ''
              )}
            </div>
          </div>
            {quantity <= 0 ? (
                <Button
                    title='Cart'
                    intlButtonId='addCartButton'
                    iconPosition='left'
                    colors='primary'
                    size='small'
                    variant='outlined'
                    className='cart-button'
                    icon={<CartIcon />}
                    onClick={e => handleClick(e)}
                />
            ) : (
                <InputIncDec
                    value={quantity}
                    onClick={(e: any) => {
                        e.stopPropagation(onclick);
                    }}
                    onUpdate={(value: number, e: any) => handleUpdate(value, e)}
                />
            )}
        </ProductInfo>
      </ProductCardWrapper>
  );
};

export default ProductCard;
