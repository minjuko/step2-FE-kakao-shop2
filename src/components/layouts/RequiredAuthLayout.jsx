import Footer from "../atoms/Footer";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import GNB from "../molecules/GNB";
import { isAuthenticated } from "../../utils/localStorage";

const staticServerUri = process.env.REACT_APP_PATH || ""

const RequiredAuthLayout = () => {
  const location = useLocation();

  if (!isAuthenticated()) {
    return (
      <Navigate
        to={staticServerUri + "/login"}
        replace
        state={{ from: location }}
      />
    );
  }

  return (
    <div className="flex flex-col min-w-screen min-h-screen">
      <GNB />
      <Outlet />
      <Footer />
    </div>
  );
}

export default RequiredAuthLayout;
