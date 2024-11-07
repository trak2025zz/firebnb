<script setup lang="ts">
import { useMediaQuery } from "@vueuse/core";
import { hotelRoom, logoIcon, styles } from "@firebnb/public";
import { twMerge } from "tailwind-merge";
import { useRouter } from "vue-router";
import { useLogin } from "../../../feature-data-access-api/auth";
import InputControl from "../components/input-control.vue";
import { useForm } from "vee-validate";
import Button from "../components/button.vue";
import { ref } from "vue";
import { loginUserSchema } from "../../../utils/schemas";
import { toTypedSchema } from "@vee-validate/zod";
import type { LoginForm } from "../../../utils/types";

const { handleSubmit } = useForm<LoginForm>({
  validationSchema: toTypedSchema(loginUserSchema),
});

const { mutate } = useLogin();
const isLoading = ref(false);

const handleFormSubmit = handleSubmit((values) => {
  mutate(values);
});
const router = useRouter();

const isMobile = useMediaQuery("(max-width: 1024px)");

const handleNavigateToRegister = () => {
  router.push("/register");
};
</script>

<template>
  <div class="w-full flex">
    <div class="w-full flex flex-col space-y-3 px-20 py-10">
      <div class="pb-3">
        <img :src="logoIcon" />
      </div>
      <div :class="styles.heading">Sign in to your account</div>
      <div :class="twMerge('text-stone-400', styles.paragraph)">
        Not a member?
        <button
          className="text-primary hover:opacity-80"
          @click="handleNavigateToRegister"
        >
          Create a new account!
        </button>
      </div>
      <form @submit.prevent="handleFormSubmit" class="space-y-2.5">
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
        <Button :isLoading="isLoading" class="w-full"> Sign in </Button>
      </form>
    </div>
    <img
      v-if="!isMobile"
      :src="hotelRoom"
      class="w-full max-w-[60%] h-[100vh] object-cover object-center"
    />
  </div>
</template>
