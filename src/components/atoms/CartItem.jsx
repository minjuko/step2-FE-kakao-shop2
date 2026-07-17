import React from "react";
import Box from "./Box";
import { comma } from "../../utils/convert";
import Counter from "./Counter";
import Button from "./Button";

const CartItem = ({ item, onChange, onDelete }) => {
  return (
    <Box className="mt-4 w-full rounded border p-4">
      <h5 className="font-bold mb-4">{item.productName}</h5>
      {item.carts.map((cart) => (
          cart.quantity > 0 ? (
        <div key={cart.id} className="cart">
          <div className="option border p-4 my-4">
            <div className="option-name">{cart.option.optionName}</div>
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  className="rounded border px-3 py-1"
                  onClick={() => {
                    onDelete(cart.id)
                  }}
                >
                  삭제
                </Button>
                <Counter
                  initCount={cart.quantity}
                  onIncrease={(count) => {
                    onChange(cart.id, count);
                  }}
                  onDecrease={(count) => {
                    onChange(cart.id, count);
                  }}
                ></Counter>
              </div>
              <div className="price font-bold">
                <span>{comma(cart.option.price * cart.quantity)}원</span>
              </div>
            </div>
          </div>
        </div>
          ):null
      ))}
      <div className="total-price">
        <div className="row border ml-0.5 mr-0.5 p-4 mt-4 w-auto flex justify-between">
          <h5>주문금액</h5>
          <div className="price text-blue-600">
            {comma(
              item.carts.reduce((acc, cur) => {
                return acc + cur.option.price * cur.quantity;
              }, 0)
            )}
            원
          </div>
        </div>
      </div>
    </Box>
  );
};

export default CartItem;
