import VinlottisPage from "@/components/VinlottisPage";
import GeneratePage from "@/components/GeneratePage";
import TodaysPage from "@/components/TodaysPage";
import AllWinesPage from "@/components/AllWinesPage";

import LoginPage from "@/components/LoginPage";
import RegisterPage from "@/components/RegisterPage";
import CreatePage from "@/components/CreatePage";

import AdminPage from "@/components/AdminPage";

import VirtualLotteryRegistrationPage from "@/components/VirtualLotteryRegistrationPage";
import VirtualLotteryPage from "@/components/VirtualLotteryPage";

const routes = [
  {
    path: "*",
    component: VinlottisPage
  },
  {
    path: "/generate",
    component: GeneratePage
  },
  {
    path: "/dagens",
    component: TodaysPage
  },
  {
    path: "/viner",
    component: AllWinesPage
  },
  {
    path: "/login",
    component: LoginPage
  },
  {
    path: "/create",
    component: CreatePage
  },
  {
    path: "/admin",
    component: AdminPage
  },
  {
    path: "/virtual",
    component: VirtualLotteryPage
  }
];

export { routes };
