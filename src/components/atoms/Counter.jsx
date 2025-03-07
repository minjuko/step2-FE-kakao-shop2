import { useState } from "react";

const Counter = ({
  initCount = 1,
  onIncrease, 
  onDecrease, 
}) => {
  const [count, setCount] = useState(initCount);
  const handleOnIncrease = () => {
    if (count < 99) {
      setCount(count + 1);
      onIncrease(count + 1);
    }
  };
  const handleOnDecrease = () => {
    if (count > 1) {
      setCount(count - 1);
      onDecrease(count - 1);
    }
  };
  return (
    <div>
      <div className="flex">
        <button className="border w-6" onClick={handleOnDecrease}>
          -
        </button>
        <div className="border w-12 text-center">{count}</div>
        <button className="border w-6" onClick={handleOnIncrease}>
          +
        </button>
      </div>
    </div>
  );
};

export default Counter;