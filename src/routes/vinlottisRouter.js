import VinlottisPage from "@/components/VinlottisPage";

const routes = [
  {
    path: "*",
    component: VinlottisPage
  },
  {
    path: "/generate",
    component: resolve => require(["@/components/GeneratePage"], resolve)
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
