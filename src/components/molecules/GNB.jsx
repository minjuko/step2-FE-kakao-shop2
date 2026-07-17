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
    <header className="w-full border-b border-gray-200 bg-white">
      <div className="mx-auto flex min-h-[64px] max-w-[1200px] flex-wrap items-center gap-3 px-4 py-3">
        <Link to={staticServerUri + "/"} aria-label="카카오 쇼핑하기 홈">
          <img src={img} alt="카카오 쇼핑하기" className="h-10 w-auto" />
        </Link>
        <nav
          className="ml-auto flex flex-wrap items-center justify-end gap-3 text-sm sm:gap-4 sm:text-base"
          aria-label="주요 메뉴"
        >
          <Link
            to={staticServerUri + "/cart"}
            className="rounded p-1 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            aria-label="장바구니"
          >
            <img src={cart} alt="" className="h-8 w-8" />
          </Link>
          {user ? (
            <Link
              to={staticServerUri + "/"}
              className="border-l pl-3 sm:pl-4"
              onClick={handleLogOut}
            >
              로그아웃
            </Link>
          ) : (
            <>
              <Link to={staticServerUri + "/login"}>
                로그인
              </Link>
              <Link
                to={staticServerUri + "/signup"}
                className="border-l pl-3 sm:pl-4"
              >
                회원가입
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default GNB;
