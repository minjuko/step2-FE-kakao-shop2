import React from 'react';
import styled from 'styled-components';
import Card from '../atoms/Card';
import { comma } from '../../utils/convert';
import Photo from '../atoms/Photo';

const staticServerUri = process.env.REACT_APP_PATH || "";

const ProductContainer = styled(Card)`
  display: flex;
  flex-direction: column;
  align-items: center;
  row-gap: 12px;
`;

const ImageContainer = styled.div`
  
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

const Title = styled.div`
  text-decoration: none;
  display: inline-block;
  font-size: 1em;
  color: black;
`;

const PriceText = styled.span`
  color: black;
  font-weight: bold;
  font-size: 1.2em;
  text-align: center;
`;

const ProductCard = ({ product }) => {
  return (
    <ProductContainer to={`${staticServerUri}/products/${product.id}`}>
      <ImageContainer>
        <Photo src={`${staticServerUri}/assets${product.image}`} alt={product.productName} className="aspect-[4/3] w-full rounded-md object-cover" />
      </ImageContainer>
      <div>
        <Title>{product.productName}</Title>
        <br/>
        <PriceText>{comma(product.price)}원</PriceText>
        
      </div>
    </ProductContainer>
  );
};

export default ProductCard;
