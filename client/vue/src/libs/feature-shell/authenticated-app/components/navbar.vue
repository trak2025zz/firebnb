<script setup lang="ts">
import { logoIcon, logoWhite } from "@firebnb/public";
import { useMediaQuery } from "@vueuse/core";
import { logout } from "../../../feature-data-access-api/auth";
import { IconLogout } from "../../../utils/icons"; 
import { useRouter } from "vue-router";

const isMobile = useMediaQuery("(max-width: 1024px)");
const router = useRouter();

  const handleLogout = () => {
    logout();
  };
const handleLogoClick = () => {
    router.push("/")
}
const handleMyHotelsClick = () => {
    router.push("/my-hotels")
}
const handleMyReservationsClick = () => {
    router.push("/my-reservations")
}
</script>

<template>
  <div class="w-full z-10 absolute top-0 left-0 p-5 md:p-10 flex items-center justify-between text-white text-md">
      <img
        v-if="isMobile"
        :src="logoIcon"
        @click="handleLogoClick"
        class="w-14 hover:opacity-80 cursor-pointer"
      />
      <img
        v-else
        :src="logoWhite"
        @click="handleLogoClick"
        class="w-32 hover:opacity-80 cursor-pointer"
      />
    <div class="flex gap-5 md:gap-10">
      <button
        @click="handleMyHotelsClick"
        :class="['hover:opacity-80', $route.path !== '/my-hotels' ? 'opacity-60' : '']"
      >
        My Hotels
      </button>
      <button
        @click="handleMyReservationsClick"
        :class="['hover:opacity-80', $route.path !== '/my-reservations' ? 'opacity-60' : '']"

      >
        My Reservations
      </button>
    </div>
    <button
      @click="handleLogout"
      class="flex items-center gap-1 opacity-60 hover:opacity-80"
    >
      <IconLogout size="28" />
      <p class="hidden md:flex">Logout</p>
    </button>
  </div>
</template>