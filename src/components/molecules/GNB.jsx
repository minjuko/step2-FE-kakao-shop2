import React from "react";
import img from '../../assets/logoKakao.png';
import cart from "../../assets/cart.png";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { setUser } from "../../store/slices/userSlice";
import { clearAuthToken, getAuthToken } from "../../utils/localStorage";

const staticServerUri = process.env.REACT_APP_PATH || "";

const GNB = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);

  useEffect(() => {
    dispatch(setUser({ user: getAuthToken() }));
  }, [dispatch]);


  const handleLogOut = () => {
    dispatch(setUser({ user: null }));
    clearAuthToken();
  };

  return (
    <header className="w-full border-b-2 border-gray-300">
      <Link to={staticServerUri + "/"} className="flex items-center px-4 py-3">
        <img src={img} alt="카카오 쇼핑하기" className="w-30 h-10" />
        <div className="ml-auto flex items-center space-x-4">
          <Link to={staticServerUri + "/cart"}>
            <img src={cart} alt="장바구니 버튼" className="w-8 h-8" />
          </Link>
          {user ? (
            <Link
              to={staticServerUri + "/"}
              className="text-300 border-l pl-4"
              onClick={handleLogOut}
            >
              로그아웃
            </Link>
          ) : (
            <>
              <Link to= {staticServerUri + "/login"} className="text-300">
                로그인
              </Link>
              <Link
                to={staticServerUri + "/signup"}
                className="text-300 border-l pl-4"
              >
                회원가입
              </Link>
            </>
          )}
        </div>
      </Link>
    </header>
  );
};

export default GNB;
