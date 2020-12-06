const VinlottisPage = () => import(
  /* webpackChunkName: "landing-page" */
  "@/components/VinlottisPage");
const LotteryPage = () => import(
  /* webpackChunkName: "landing-page" */
  "@/components/LotteryPage");
const GeneratePage = () => import(
  /* webpackChunkName: "landing-page" */
  "@/components/GeneratePage");

const TodaysPage = () => import(
  /* webpackChunkName: "sub-pages" */
  "@/components/TodaysPage");
const AllWinesPage = () => import(
  /* webpackChunkName: "sub-pages" */
  "@/components/AllWinesPage");
const HistoryPage = () => import(
  /* webpackChunkName: "sub-pages" */
  "@/components/HistoryPage");
const WinnerPage = () => import(
  /* webpackChunkName: "sub-pages" */
  "@/components/WinnerPage");

const LoginPage = () => import(
  /* webpackChunkName: "user" */
  "@/components/LoginPage");
const CreatePage = () => import(
  /* webpackChunkName: "user" */
  "@/components/CreatePage");
const AdminPage = () => import(
  /* webpackChunkName: "admin" */
  "@/components/AdminPage");

const PersonalHighscorePage = () => import(
  /* webpackChunkName: "highscore" */
  "@/components/PersonalHighscorePage");
const HighscorePage = () => import(
  /* webpackChunkName: "highscore" */
  "@/components/HighscorePage");

const RequestWine = () => import(
  /* webpackChunkName: "request" */
  "@/components/RequestWine");
const AllRequestedWines = () => import(
  /* webpackChunkName: "request" */
  "@/components/AllRequestedWines");

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
    name: "All viner",
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
    name: "Admin side",
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
    path: "/history",
    name: "Historie",
    component: HistoryPage
  },
  {
    path: "/highscore/:name",
    name: "Personlig topplisten",
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
    name: "Etterspurte vin",
    component: AllRequestedWines
  }
];

export { routes };
