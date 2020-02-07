import VinlottisPage from "@/components/VinlottisPage";
import GeneratePage from "@/components/GeneratePage";
import TodaysPage from "@/components/TodaysPage";
import AllWinesPage from "@/components/AllWinesPage";

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
    component: resolve => require(["@/components/LoginPage"], resolve)
  },
  {
    path: "/update",
    component: resolve => require(["@/components/RegisterPage"], resolve)
  },
  {
    path: "/create",
    component: resolve => require(["@/components/CreatePage"], resolve)
  }
];

export { routes };
