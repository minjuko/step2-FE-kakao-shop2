import { useEffect } from "react";
import Container from "../atoms/Container";
import ProductGrid from "../organisms/ProductGrid";
import { fetchProducts } from "../../services/product";
import { useInfiniteQuery } from "@tanstack/react-query";
import CardSkeleton from "../atoms/CardSkeleton";
import { useInView } from "react-intersection-observer";
import { queryKeys } from "../../services/queryKeys";
import QueryStatus from "../atoms/QueryStatus";

const MainProductTemplate = () => {
    const {ref, inView} = useInView();

    /**
     * 상품 목록 조회 API 에러 캐칭 시나리오
     * 1. 네트워크 오류: 상품 조회 실패 화면과 재시도 안내를 표시한다.
     * 2. 그 외 서버 오류: 상품 목록 대신 오류 상태를 표시한다.
     * 3. 정상 응답이 빈 배열인 경우: 등록된 상품이 없다는 빈 상태를 표시한다.
     */
    const {
        data: products, 
        isLoading, 
        isError,
        isFetchingNextPage, 
        fetchNextPage, 
        hasNextPage
    } = useInfiniteQuery(queryKeys.products, ({pageParam = 0}) => fetchProducts(pageParam), {
        getNextPageParam: (lastPage, pages) => {
            if (lastPage.length === 0) {
                return undefined;
            }
            return pages.length;
        },
        enabled:true,
    }); 

    useEffect(() => {
      if (inView && !isLoading && hasNextPage) { // !isLoading 추가
        fetchNextPage();
      }
    }, [fetchNextPage, inView, isLoading, hasNextPage]);
  
    if (isError) {
      return (
        <QueryStatus
          isError
          title="상품을 불러오지 못했습니다."
          message="잠시 후 다시 시도해주세요."
        />
      );
    }

    const productList = products?.pages.flat() ?? [];

    return(
        <Container className="mainproduct">
            {isLoading ? <CardSkeleton /> : productList.length > 0 ? (
              <ProductGrid products={productList}/>
            ) : (
              <QueryStatus title="등록된 상품이 없습니다." />
            )}
            <div ref={ref}></div>
            {isFetchingNextPage && <CardSkeleton />}
        </Container>
    );
};

export default MainProductTemplate;
