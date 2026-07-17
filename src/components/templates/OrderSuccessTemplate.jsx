import { useQuery } from "@tanstack/react-query";
import { comma } from "../../utils/convert";
import { useNavigate, useParams } from "react-router-dom";
import { getOrderFromId } from "../../services/order";
import Title from "../atoms/Title";
import Box from "../atoms/Box";
import Button from "../atoms/Button";
import { queryKeys } from "../../services/queryKeys";
import Loader from "../atoms/Loader";
import QueryStatus from "../atoms/QueryStatus";

const staticServerUri = process.env.REACT_APP_PATH || "";

const OrderSuccessTemplate = () => {
  const { id } = useParams();

  /**
   * 주문 결과 조회 API 에러 캐칭 시나리오
   * 1. 401: 보호 라우트에서 미인증 사용자를 로그인 페이지로 이동시킨다.
   * 2. 404: 존재하지 않는 주문 번호임을 조회 실패 상태로 안내한다.
   * 3. 네트워크 및 서버 오류: 주문 결과 조회 실패 상태를 표시한다.
   */
  const { data, isLoading, isError } = useQuery(
    queryKeys.order(id),
    () => getOrderFromId(id)
  );

  const navigate = useNavigate();

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return (
      <QueryStatus
        isError
        title="주문 결과를 불러오지 못했습니다."
        message="주문 번호를 확인한 뒤 다시 시도해주세요."
      />
    );
  }

  const orderId = data.id;
  const orderProducts = data.products;
  const orderTotalPrice = data.totalPrice;

  return (
    <div>
      <Title> 주문 완료 </Title>
      <Box className="border w-100 p-4">
      <div className="border font-bold ">주문상품 정보</div>
      <div className="border">주문번호: {orderId}</div>
      <div>
        {data &&
          orderProducts.map((item) => {
            return (
              <div key={item.productName} className="border p-4 my-4">
                <div className="font-bold"> 상품명 {item.productName}</div>
                <div className="grid grid-rows-1 md:grid-rows-2 gap-4">
                  {item.items.map((option) => {
                    return (
                      <div key={option.id} className=" p-2 mb-2 ">
                        <div> 옵션명 {option.optionName}</div>
                        <div> 수량 {option.quantity}</div>
                        <div> 가격 {comma(option.price)}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
      </div>
      <div className="row flex justify=between border p-4">총 주문 금액 
        <div className="ml-[15px] mr-[15px] font-bold text-blue-600">{comma(orderTotalPrice)} 원</div>
        </div>
        </Box>
        <Button
          className="p-2 font-bold text-center bg-yellow-300 rounded-md mt-10 ml-[3%] w-[95%]"
          onClick={() => {
          navigate(staticServerUri + "/");
        }}
      >
        <span>쇼핑 계속하기</span>
      </Button>
    </div>
    
  );
};

export default OrderSuccessTemplate;
