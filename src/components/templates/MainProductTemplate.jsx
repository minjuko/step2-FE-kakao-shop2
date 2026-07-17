import { Suspense, useEffect } from "react";
import Container from "../atoms/Container";
import ProductGrid from "../organisms/ProductGrid";
import { fetchProducts } from "../../services/product";
import { useInfiniteQuery } from "@tanstack/react-query";
import CardSkeleton from "../atoms/CardSkeleton";
import { useInView } from "react-intersection-observer";
import { queryKeys } from "../../services/queryKeys";

const MainProductTemplate = () => {
    const {ref, inView} = useInView();
    const {
        data: products, 
        isLoading, 
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
        onError: (error) => {
            console.error("fetch product 실패", error);
            alert("네트워크 연결이 원활하지 않습니다.");
        },
        enabled:true,
    }); 

    useEffect(() => {
      if (inView && !isLoading && hasNextPage) { // !isLoading 추가
        fetchNextPage();
      }
    }, [fetchNextPage, inView, isLoading, hasNextPage]);
  
    return(
        <Container className="mainproduct">
            <Suspense fallback={<><CardSkeleton /></>}>
                {isLoading ? (<CardSkeleton />) :  <ProductGrid products={products.pages.flat()}/>}
                <div ref={ref}></div>
                {isFetchingNextPage && <CardSkeleton />}
            </Suspense>
        </Container>
    );
};

export default MainProductTemplate;
