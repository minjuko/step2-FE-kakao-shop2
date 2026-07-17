import { useParams } from "react-router";
import { getProductById } from "../services/product";
import { useQuery } from "@tanstack/react-query";
import ProductInformationColumn from "../components/molecules/ProductInformationColumn";
import OptionColumn from "../components/molecules/OptionColumn";
import Loader from "../components/atoms/Loader";
import { queryKeys } from "../services/queryKeys";

const ProductDetailPage = () => {
    const { id } = useParams(); 
    const { data: product, isError, isLoading} = useQuery(
      queryKeys.product(id),
      () => getProductById(id)
    );

  if(isLoading) {
    return (
      <Loader />
    )
  }

  if(isError) {
    return <p role="alert">상품 정보를 불러오지 못했습니다.</p>;
  }

    return (
        <div className="flex justify-around h-280">
        <ProductInformationColumn product={product}/>
        <div className="h-full border-l"/>
        <OptionColumn product={product}/>
      </div>

    );
};

export default ProductDetailPage;
