<script setup lang="ts">
import { hotelRoom, styles } from "@firebnb/public";
import { twMerge } from "tailwind-merge";
import { ref, reactive, watch } from "vue";
import { BnbType, BnbsSearchType, DateRangeType } from "../../../utils/types/bnb";
import { useCreateReservation } from "../../../feature-data-access-api/reservation";
import { useBnbs } from "../../../feature-data-access-api/bnb";
import { toast } from "vue3-toastify";
import moment from "moment";
import { onClickOutside } from "@vueuse/core";
import HomepageHero from "../components/homepage-hero.vue";
import Navbar from "../components/navbar.vue";
import Button from "../../unauthenticated-app/components/button.vue";

let searchCriteria = reactive<BnbsSearchType>({});

const bookMeModalOpen = ref(false);
const selectedBnb = ref<BnbType | null>(null);
const dateRange = reactive({
  startDate: new Date(),
  endDate: new Date(),
});
const modalRef = ref();
const { data: bnbs } = useBnbs(searchCriteria);
const {
  mutate: createReservation,
  status,
  isPending: isCreateReservationPending,
} = useCreateReservation();

watch(
  () => status.value,
  (newStatus) => {
    if (newStatus === "success") {
      bookMeModalOpen.value = false;
      toast.success("Reservation created successfully!");
      selectedBnb.value = null;
      dateRange.startDate = new Date();
      dateRange.endDate = new Date();
    } else if (newStatus === "error") {
      toast.error("Creating reservation error!");
    }
  }
);

const onSubmit = async () => {
  if (!selectedBnb) return;
  console.log(dateRange)
  await createReservation({
    start_date: dateRange.startDate.toISOString().split("T")[0],
    end_date: dateRange.endDate.toISOString().split("T")[0],
    bnb_id: String(selectedBnb?.value?._id),
  });
};
const handleSearch = (searchParams: BnbsSearchType) => {
  searchCriteria = searchParams;
};

const handleBookMeClicked = (bnb: BnbType) => {
  bookMeModalOpen.value = true;
  selectedBnb.value = bnb;
};

onClickOutside(modalRef, () => {
  bookMeModalOpen.value = false;
});

const updateDateRange = (newDateRange: DateRangeType) => {
  dateRange.startDate = newDateRange.start;
  dateRange.endDate = newDateRange.end;
};

</script>

<template>
  <div class="relative bg-black">
    <Navbar />
    <HomepageHero :onSearch="handleSearch" />
    <img
      :src="hotelRoom"
      class="w-screen h-screen object-cover object-bottom opacity-50"
    />
  </div>
  <div class="bg-white p-5 md:p-10">
    <p :class="styles.heading">All Hotels</p>
    <div class="flex flex-col space-y-2 pt-5">
      <div
        v-for="(bnb, index) in bnbs"
        :key="index"
        :class="[
          'grid gap-2 grid-cols-[5fr_1fr] place-items-center justify-items-end',
          { 'border-b border-stone-200': index !== bnbs.length - 1 },
        ]"
      >
        <div class="py-1 grid gap-2 grid-cols-[4fr_2fr_2fr_2fr] w-full">
          <div class="flex flex-col">
            <p :class="twMerge('text-stone-400', styles.paragraph2)">Address</p>
            <p :class="styles.paragraph">{{ bnb?.address }}</p>
          </div>
          <div class="flex flex-col">
            <p :class="twMerge('text-stone-400', styles.paragraph2)">Space</p>
            <p :class="styles.paragraph">{{ bnb?.space }} m<sup>2</sup></p>
          </div>
          <div class="flex flex-col">
            <p :class="twMerge('text-stone-400', styles.paragraph2)">Cost</p>
            <p :class="styles.paragraph">{{ bnb?.cost }} pln/night</p>
          </div>
          <div class="flex flex-col">
            <p :class="twMerge('text-stone-400', styles.paragraph2)">Updated</p>
            <p :class="styles.paragraph">
              {{ moment(bnb?.updatedAt).fromNow() }}
            </p>
          </div>
        </div>
        <Button variant="primary-inverted" @click="handleBookMeClicked(bnb)">
          Book me!
        </Button>
      </div>
      <div
        v-if="bookMeModalOpen"
        ref="modalRef"
        class="p-5 bg-white rounded-lg fixed z-20 top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2 shadow-background"
      >
        <p :class="twMerge('pb-2.5', styles.heading)">Create reservation</p>
        <form @submit.prevent="onSubmit">
          <div class="flex flex-col space-y-2.5">
            <VDatePicker
              v-model.range="dateRange"
              mode="date"
              color="red"
              :minDate="new Date()"
              :date="new Date()"
              :maxDate="new Date(new Date().setDate(new Date().getDate() + 90))"
              @update:modelValue="updateDateRange"
            />
            <Button :isLoading="isCreateReservationPending">
              Confirm reservation
            </Button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
