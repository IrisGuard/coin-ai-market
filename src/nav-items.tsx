
import Index from "./pages/Index";
import Admin from "./pages/Admin";
import Auth from "./pages/Auth";
import Marketplace from "./pages/Marketplace";
import Profile from "./pages/Profile";
import TokenPage from "./pages/TokenPage";
import Auctions from "./pages/Auctions";
import DealerPanel from "./pages/DealerPanel";

export const navItems = [
  {
    title: "Home",
    to: "/",
    page: <Index />,
  },
  {
    title: "Marketplace", 
    to: "/marketplace",
    page: <Marketplace />,
  },
  {
    title: "Auctions",
    to: "/auctions", 
    page: <Auctions />,
  },
  {
    title: "Token",
    to: "/token",
    page: <TokenPage />,
  },
  {
    title: "Dealer",
    to: "/dealer",
    page: <DealerPanel />,
  },
  {
    title: "Profile",
    to: "/profile",
    page: <Profile />,
  },
  {
    title: "Auth",
    to: "/auth",
    page: <Auth />,
  },
  {
    title: "Admin",
    to: "/admin",
    page: <Admin />,
  },
];
