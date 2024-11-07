import { logoIcon, logoWhite } from "public/assets";
import { useLocation, useNavigate } from "react-router-dom";
import { useMediaQuery } from "usehooks-ts";
import { useLogout } from "../../../feature-data-access-api/auth";
import { IconLogout } from "../../../utils/icons/logout";

export const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { mutate: logout } = useLogout();
  const isMobile = useMediaQuery("(max-width: 1024px)");

  const handleLogout = () => {
    logout();
  };
  return (
    <div className="w-full z-10 absolute top-0 left-0 p-5 md:p-10 flex items-center justify-between text-white text-md">
      {isMobile ? (
        <img
          src={logoIcon}
          onClick={() => navigate("/")}
          className="w-14 hover:opacity-80 cursor-pointer"
        />
      ) : (
        <img
          src={logoWhite}
          onClick={() => navigate("/")}
          className="w-32 hover:opacity-80 cursor-pointer"
        />
      )}

      <div className="flex gap-5 md:gap-10">
        <button
          onClick={() => navigate("/my-hotels")}
          className={`hover:opacity-80 ${
            location.pathname !== "/my-hotels" && "opacity-60"
          }`}
        >
          My Hotels
        </button>
        <button
          onClick={() => navigate("/my-reservations")}
          className={`hover:opacity-80 ${
            location.pathname !== "/my-reservations" && "opacity-60"
          }`}
        >
          My Reservations
        </button>
      </div>
      <button
        onClick={handleLogout}
        className="flex items-center gap-1 opacity-60 hover:opacity-80"
      >
        <IconLogout size={28} />
        <p className="hidden md:flex">Logout</p>
      </button>
    </div>
  );
};

export default Navbar;
