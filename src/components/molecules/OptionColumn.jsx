import { useState } from "react";
import OptionList from "../atoms/OptionList";
import Button from "../atoms/Button";
import { addCart } from "../../services/cart";
import Container from "../atoms/Container";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../../services/queryKeys";
import useApiErrorHandler from "../../hooks/useApiErrorHandler";
import Counter from "../atoms/Counter";
import { comma } from "../../utils/convert";
import { useNavigate } from "react-router";

const staticServerUri = process.env.REACT_APP_PATH || "";

const OptionColumn = ({ product }) => {
  const [selectedOptions, setSelectedOptions] = useState([]);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const handleApiError = useApiErrorHandler();

  const handleOnClickOption = (option) => {
    const isOptionSelected = selectedOptions.find(
      (el) => el.optionId === option.id
    );

    if (isOptionSelected) {
      return;
    }

    setSelectedOptions((prev) => [
      ...prev,
      {
        optionId: option.id,
        quantity: 1,
        price: option.price,
        name: option.optionName,
      },
    ]);
  };

  const handleOnChange = (count, optionId) => {
    setSelectedOptions((prev) => {
      return prev.map((el) => {
        if (el.optionId === optionId) {
          return {
            ...el,
            quantity: count,
          };
        }
        return el;
      });
    });
  };

  /**
   * 장바구니 추가 API 에러 캐칭 시나리오
   * 1. 401: 인증 정보를 제거하고 로그인 페이지로 이동한다.
   * 2. 404: 상품 또는 옵션을 찾을 수 없는 경우 404 페이지로 이동한다.
   * 3. 네트워크 오류: 사용자에게 네트워크 연결 확인을 안내한다.
   * 4. 그 외 서버 오류: 중복 옵션 가능성을 포함한 장바구니 추가 실패 메시지를 안내한다.
   *
   * 상태 코드별 공통 동작은 useApiErrorHandler에서 처리한다.
   */
  const { mutate } = useMutation({
    mutationFn: addCart,
    onError: (error) => handleApiError(
      error,
      "장바구니에 상품을 담지 못했습니다. 같은 옵션이 있다면 장바구니에서 수량을 조정해주세요."
    ),
  });
 
  return (
    <div className="flex flex-col items-center sticky top-0 h-200 pb-96">
      <div className="my-2">옵션 선택</div>
      <OptionList
        options={product.options} onClick={handleOnClickOption}
      />
    <Container className="text-sm mt-5">
      <div className="flex">
        <span className="font-bold mr-1">배송 방법</span><span>택배배송</span>
      </div>
      <span className="font-bold">배송비</span>
      <div className="border border-gray-500 rounded-sm bg-gray-200 text-gray-500 p-0.5 text-xs">무료배송</div>
      <span>제주 추가 3,000원, 제주 외 도서지역 추가 6,000원</span>
    </Container>
      <Container className="w-full mb-2 border border-gray-300">
          {selectedOptions.map((option) => (
             <ol key={option.optionId} className="selected-option-list">
             <li className="w-full mb-2 border border-gray-300">
               <div className="flex justify-between">
                 <div className="name">{option.name}</div>
                 <div className="price">
                   {comma(option.price * option.quantity)}원
                 </div>
               </div>
               <Counter
                 onIncrease={(count) => handleOnChange(count, option.optionId)}
                 onDecrease={(count) => handleOnChange(count, option.optionId)}
               />
             </li>
           </ol>
          ))}
      </Container>

      <Container className="flex justify-between w-full">
      <div className="flex justify-between my-4">
        <div>
          총 수량:{" "}
          {selectedOptions.reduce((acc, cur) => {
            return acc + cur.quantity;
          }, 0)}
          개
        </div>
        <div>
          총 상품금액:{" "}
          {comma(
            selectedOptions.reduce((acc, cur) => {
              return acc + cur.quantity * cur.price;
            }, 0)
          )}
          원
        </div>
      </div>
      </Container>

      <Container className="flex w-full mt-3">
        <Button
          className="w-15 p-2 mr-1 text-100 h-10 bg-gray-800 rounded-md text-white"
          onClick={() => {
            mutate(
              selectedOptions.map((el) => {
                return {
                  optionId: el.optionId,
                  quantity: el.quantity,
                };
              }),
              {
                onSuccess: async () => {
                  await queryClient.invalidateQueries(queryKeys.cart);
                  navigate(staticServerUri + "/cart");
                },
              }
            );
          }}
        >
          장바구니 담기
        </Button>
        <Button
          className="w-38 p-2 text-100 h-10 bg-yellow-300 rounded-md"
          onClick={() => {
            alert("주문 페이지로 이동합니다.");
          }}
        >
          구매하기
        </Button>

      </Container>
    </div>
  );
};

export default OptionColumn;
