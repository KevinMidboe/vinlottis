import VinlottisPage from "@/components/VinlottisPage";
import GeneratePage from "@/components/GeneratePage";
import TodaysPage from "@/components/TodaysPage";
import AllWinesPage from "@/components/AllWinesPage";

import LoginPage from "@/components/LoginPage";
import CreatePage from "@/components/CreatePage";

import AdminPage from "@/components/AdminPage";

import WinnerPage from "@/components/WinnerPage";
import LotteryPage from "@/components/LotteryPage";
import HistoryPage from "@/components/HistoryPage";

import RequestWine from "@/components/RequestWine";

const routes = [
  {
    path: "*",
    component: VinlottisPage
  },
  {
    path: "/lottery",
    component: LotteryPage
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
    path: "/lottery/:tab",
    component: LotteryPage
  },
  {
    path: "/winner/:id",
    component: WinnerPage
  },
  {
    path: "/history",
    component: HistoryPage
  },
  {
    path: "/request",
    component: RequestWine
  }
];

export { routes };
