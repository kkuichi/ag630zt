import { createRouter, createWebHistory } from "vue-router";
import { useAuth } from "../composables/useAuth.js";

import ContactView from "../views/ContactView.vue";
import LoginView from "../views/LoginView.vue";

import AdminPanelView from "../views/AdminPanelView.vue";
import CompaniesView from "../views/admin/CompaniesView.vue";
import AddCompanyView from "../views/admin/AddCompanyView.vue";
import AccountsView from "../views/admin/AccountsView.vue";
import AddAccountView from "../views/admin/AddAccountView.vue";
import AdminHomeView from "../views/admin/AdminHomeView.vue";
import AdminCoursesView from "../views/admin/CoursesView.vue";
import AddCourseView from "../views/admin/AddCourseView.vue";
import EditCourseView from "../views/admin/EditCourseView.vue";
import AdminResourcesView from "../views/admin/ResourcesView.vue";
import AddResourceView from "../views/admin/AddResourceView.vue";
import EditResourceView from "../views/admin/EditResourceView.vue";

import UserPanelView from "../views/UserPanelView.vue";
import UserHomeView from "../views/user/UserHomeView.vue";
import MyCompanyView from "../views/user/MyCompanyView.vue";
import EmployeesView from "../views/user/EmployeesView.vue";
import ReportsView from "../views/user/ReportsView.vue";
import ProfileView from "../views/user/ProfileView.vue";
import NewReportView from "../views/user/NewReportView.vue";
import NewEmployeeView from "../views/user/NewEmployeeView.vue";
import ReportView from "../views/user/ReportView.vue";
import MyReportsView from "../views/user/MyReportsView.vue";
import CoursesView from "../views/user/CoursesView.vue";
import AssignCourseView from "../views/user/AssignCourseView.vue";
import MyCoursesView from "../views/user/MyCoursesView.vue";
import TakeTestView from "../views/user/TakeTestView.vue";
import ResourcesView from "../views/user/ResourcesView.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", redirect: "/login" },
    { path: "/contact", name: "contact", component: ContactView },
    { path: "/login", name: "login", component: LoginView },
    {
      path: "/admin",
      name: "admin",
      component: AdminPanelView,
      meta: { requiresAuth: true, role: "admin" },
      children: [
        { path: "", name: "admin-home", component: AdminHomeView },
        { path: "companies", name: "companies", component: CompaniesView },
        { path: "companies/add", component: AddCompanyView },
        { path: "accounts", component: AccountsView },
        { path: "accounts/add", component: AddAccountView },
        { path: "elearning", component: AdminCoursesView },
        { path: "elearning/add", component: AddCourseView },
        { path: "elearning/edit/:id", component: EditCourseView },
        { path: "resources", component: AdminResourcesView },
        { path: "resources/add", component: AddResourceView },
        { path: "resources/edit/:id", component: EditResourceView },
      ],
    },
    {
      path: "/user",
      name: "user",
      component: UserPanelView,
      meta: { requiresAuth: true },
      children: [
        { path: "", component: UserHomeView },
        { path: "company", component: MyCompanyView },
        { path: "employees", component: EmployeesView, meta: { roles: ["manažér"] } },
        { path: "employees/new", component: NewEmployeeView, meta: { roles: ["manažér"] } },
        { path: "reports", component: ReportsView, meta: { roles: ["manažér"] } },
        { path: "reports/new", component: NewReportView },
        { path: "reports/my", component: MyReportsView, meta: { roles: ["zamestnanec"] } },
        { path: "reports/:id", component: ReportView, meta: { roles: ["manažér", "zamestnanec"] } },
        { path: "elearning", component: CoursesView, meta: { roles: ["manažér"] } },
        { path: "elearning/assign", component: AssignCourseView, meta: { roles: ["manažér"] } },
        { path: "elearning/my", component: MyCoursesView, meta: { roles: ["zamestnanec", "študent"] } },
        { path: "elearning/take/:id", component: TakeTestView, meta: { roles: ["zamestnanec", "študent"] } },
        { path: "elearning/resources", component: ResourcesView },
        { path: "profile", component: ProfileView },
      ],
    },
  ],
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");

  if (to.meta.requiresAuth && !token) {
    return next("/login");
  }

  const { getRole } = useAuth();
  const role = getRole();

  if (to.meta.role && role !== to.meta.role) {
    return next("/user");
  }

  if (to.meta.roles && !to.meta.roles.includes(role)) {
    return next("/user");
  }

  next();
});

export default router;
