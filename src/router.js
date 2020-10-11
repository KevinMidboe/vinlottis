import VueRouter from "vue-router";

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
import HighscorePage from "@/components/HighscorePage";

import RequestWine from "@/components/RequestWine";
import AllRequestedWines from "@/components/AllRequestedWines";

const routes = [
  {
    path: "*",
    name: "Hjem",
    component: VinlottisPage
  },
  {
    path: "/lottery",
    name: "Lotteri",
    component: LotteryPage
  },
  {
    path: "/dagens",
    name: "Dagens vin",
    component: TodaysPage
  },
  {
    path: "/viner",
    name: "Alle viner",
    component: AllWinesPage
  },
  {
    path: "/login",
    name: "Login",
    component: LoginPage
  },
  {
    path: "/create",
    name: "Registrer",
    component: CreatePage
  },
  {
    path: "/admin",
    name: "Admin",
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
    path: "/history/:date",
    name: "Historie for dato",
    component: HistoryPage
  },
  {
    path: "/history/",
    name: "Historie",
    component: HistoryPage
  },
  {
    path: "/highscore/:name",
    name: "Personlig toppliste",
    component: PersonalHighscorePage
  },
  {
    path: "/highscore",
    name: "Topplisten",
    component: HighscorePage
  },
  {
    path: "/request",
    name: "Etterspør vin",
    component: RequestWine
  },
  {
    path: "/requested-wines",
    name: "Etterspurte viner",
    component: AllRequestedWines
  }
];

const router = new VueRouter({
  routes: routes,
  mode: "history"
});

export default router;
