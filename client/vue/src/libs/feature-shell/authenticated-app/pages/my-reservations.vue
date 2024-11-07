<script setup lang="ts">
import { hotelRoom, styles } from "@firebnb/public";
import moment from "moment";
import Navbar from "../components/navbar.vue";
import Button from "../../unauthenticated-app/components/button.vue";
import {
  useUserReservations,
  useDeleteReservation,
} from "../../../feature-data-access-api/reservation";
import { ReservationType } from "../../../utils/types/reservation";
import { IconDelete } from "../../../utils/icons";

const { data: myReservations } = useUserReservations();
const { mutate: deleteReservation } = useDeleteReservation();

const handleDeleteReservation = async (reservation: ReservationType) => {
  await deleteReservation(reservation?.id);
};
</script>

<template>
  <div class="relative bg-black">
    <Navbar />
    <img
      :src="hotelRoom"
      class="w-screen h-24 md:h-[7.5rem] object-cover object-center opacity-50"
    />
  </div>
  <div class="bg-white p-5 md:p-10">
    <p :class="styles.heading">My Reservations</p>
    <div class="flex flex-col space-y-2 pt-5">
      <div v-if="myReservations?.data?.length < 1">
        <div :class="[styles.heading, 'text-stone-400 font-thin text-center mt-20']">
          No reservations
        </div>
      </div>
      <div
        v-for="(reservation, index) in myReservations?.data"
        :key="index"
        :class="[
          'grid gap-2 grid-cols-[5fr_1fr] place-items-center justify-items-end',
          index !== myReservations?.data?.length - 1
            ? 'border-b border-stone-200'
            : '',
        ]"
      >
        <div class="py-1 grid gap-2 grid-cols-[4fr_2fr_2fr_2fr] w-full">
          <div class="flex flex-col">
            <p :class="[styles.paragraph2, 'text-stone-400']">Address</p>
            <p :class="styles.paragraph">
              {{ reservation?.bnb?.address }}
            </p>
          </div>
          <div class="flex flex-col">
            <p :class="[styles.paragraph2, 'text-stone-400']">Space</p>
            <p :class="styles.paragraph">
              {{ reservation?.bnb?.space }} m<sup>2</sup>
            </p>
          </div>
          <div class="flex flex-col">
            <p :class="[styles.paragraph2, 'text-stone-400']">Cost</p>
            <p :class="styles.paragraph">
              {{ reservation?.bnb?.cost }} pln/night
            </p>
          </div>
          <div class="flex flex-col">
            <p :class="[styles.paragraph2, 'text-stone-400']">Updated</p>
            <p :class="styles.paragraph">
              {{ moment(reservation?.updatedAt).fromNow() }}
            </p>
          </div>
        </div>
        <button
          class="text-primary pt-2"
          @click="handleDeleteReservation(reservation)"
        >
          <IconDelete />
        </button>
      </div>
    </div>
  </div>
</template>
