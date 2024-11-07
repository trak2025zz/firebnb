<script setup lang="ts">
import { hotelRoom, logoIcon, styles } from "@firebnb/public";
import { toTypedSchema } from "@vee-validate/zod";
import { useMediaQuery } from "@vueuse/core";
import { twMerge } from "tailwind-merge";
import { useForm } from "vee-validate";
import { useRouter } from "vue-router";
import { registerUserSchema } from "../../../utils/schemas";
import type { RegisterForm } from "../../../utils/types";
import { useRegister } from "../../../feature-data-access-api/auth";
import InputControl from "../components/input-control.vue";
import Button from "../components/button.vue";

const isMobile = useMediaQuery("(max-width: 1024px)");

const router = useRouter();

const handleNavigateToLogin = () => {
  router.push("/");
};

const { mutate } = useRegister();

const { handleSubmit } = useForm<RegisterForm>({
  validationSchema: toTypedSchema(registerUserSchema),
});

const handleFormSubmit = handleSubmit((values) => {
  const { password_confirmation, ...restValues } = values;
  mutate(restValues);
});
</script>

<template>
  <div class="w-full flex">
    <div class="w-full flex flex-col space-y-3 px-20 py-10">
      <div class="pb-3">
        <img :src="logoIcon" />
      </div>
      <div :class="styles.heading">Sign up</div>
      <div :class="twMerge('text-stone-400', styles.paragraph)">
        Already have an account?
        <button
          class="text-primary hover:opactiy-80"
          @click="handleNavigateToLogin"
        >
          Sign in!
        </button>
      </div>
      <form @submit.prevent="handleFormSubmit" class="space-y-2.5">
        <InputControl
          label="Full name"
          name="full_name"
          placeholder="e.g. John Doe"
        />
        <InputControl
          label="Email address"
          name="email"
          placeholder="mail@example.com"
        />
        <InputControl
          label="Password"
          name="password"
          type="password"
          placeholder="********"
        />
        <InputControl
          label="Confirm password"
          name="password_confirmation"
          type="password"
          placeholder="********"
        />
        <Button class="w-full"> Sign in </Button>
      </form>
    </div>
    <img
      v-if="!isMobile"
      :src="hotelRoom"
      class="w-full max-w-[60%] h-[100vh] object-cover object-center"
    />
  </div>
</template>
