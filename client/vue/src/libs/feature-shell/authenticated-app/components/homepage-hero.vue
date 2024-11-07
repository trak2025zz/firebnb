<script setup lang="ts">
import { BnbsSearchType } from "../../../utils/types/bnb";
import InputControl from "../../unauthenticated-app/components/input-control.vue";
import {
  IconAddress,
  IconCoin,
  IconMeasure,
  IconSearch,
} from "../../../utils/icons";
import { useForm } from "vee-validate";

interface HomepageHeroProps {
  onSearch: (formData: BnbsSearchType) => void;
}

const props = withDefaults(defineProps<HomepageHeroProps>(), {
  onSearch: () => {},
});

const { handleSubmit } = useForm();
const onSubmit = (formData: BnbsSearchType) => {
  props.onSearch(formData);
};
</script>

<template>
  <div
    class="z-10 w-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col space-y-5 text-center"
  >
    <div
      class="flex flex-col text-white font-normal text-2xl md:text-5xl tracking-widest"
    >
      FIND YOUR FAVOURITE
      <span class="text-3xl md:text-6xl font-bold">HOTEL FOR STAY</span>
    </div>
    <form
      @submit.prevent="
        {
          handleSubmit(onSubmit);
        }
      "
    >
      <div
        class="p-3 flex flex-col md:flex-row md:py-4 md:space-x-4 bg-white rounded-lg w-fit mx-auto"
      >
        <div class="flex flex-col">
          <div class="flex gap-2">
            <IconAddress />
            <p>Address</p>
          </div>
          <InputControl :fieldErrorMessage="false" name="address_like" />
        </div>
        <div class="flex flex-col w-72 md:w-40">
          <div class="flex gap-2">
            <IconCoin />
            <p>Cost (min/max)</p>
          </div>
          <div class="flex gap-1">
            <InputControl
              fieldErrorMessage="{false}"
              control="{control}"
              name="min_cost"
            />
            <InputControl
              fieldErrorMessage="{false}"
              control="{control}"
              name="max_cost"
            />
          </div>
        </div>
        <div class="flex flex-col w-72 md:w-40">
          <div class="flex gap-2">
            <IconMeasure />
            <p>Space (min/max)</p>
          </div>
          <div class="flex gap-1">
            <InputControl
              fieldErrorMessage="{false}"
              control="{control}"
              name="min_space"
            />
            <InputControl
              fieldErrorMessage="{false}"
              control="{control}"
              name="max_space"
            />
          </div>
        </div>
        <button
          type="submit"
          class="ml-auto md:ml-0 pt-1 md:pt-0 text-white hover:opacity-80"
        >
          <IconSearch />
        </button>
      </div>
    </form>
  </div>
</template>
