import { VueQueryPlugin } from "@tanstack/vue-query";
import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import "../../../public/index.css";
import 'vue3-toastify/dist/index.css';
import "v-calendar/style.css";
import App from "./App.vue";
import Homepage from "./libs/feature-shell/authenticated-app/pages/homepage.vue";
import MyHotels from "./libs/feature-shell/authenticated-app/pages/my-hotels.vue";
import MyReservations from "./libs/feature-shell/authenticated-app/pages/my-reservations.vue";
import Login from "./libs/feature-shell/unauthenticated-app/pages/login.vue";
import Register from "./libs/feature-shell/unauthenticated-app/pages/register.vue";
import Vue3Toastify, { type ToastContainerOptions } from "vue3-toastify";
import VCalendar from 'v-calendar';

const unauthenticatedRoutes = [
  {
    path: "/",
    component: Login,
  },
  {
    path: "/login",
    component: Login,
  },
  {
    path: "/register",
    component: Register,
  },
];

const authenticatedRoutes = [
  {
    path: "/",
    component: Homepage,
  },
  {
    path: "/my-hotels",
    component: MyHotels,
  },
  {
    path: "/my-reservations",
    component: MyReservations,
  },
];

const token = localStorage.getItem("token");

const router = createRouter({
  history: createWebHistory(),
  routes:
    token && token !== "undefined"
      ? authenticatedRoutes
      : unauthenticatedRoutes,
});

createApp(App)
  .use(VueQueryPlugin)
  .use(Vue3Toastify, {
    autoClose: 2500,
    position: "top-center"
  } as ToastContainerOptions)
  .use(VCalendar, {})
  .use(router)
  .mount("#root");
