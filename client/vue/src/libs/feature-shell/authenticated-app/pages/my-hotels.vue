<script setup lang="ts">
import { hotelRoom, styles } from "@firebnb/public";
import moment from "moment";
import Navbar from "../components/navbar.vue";
import Button from "../../unauthenticated-app/components/button.vue";
import InputControl from "../../unauthenticated-app/components/input-control.vue";
import { ref, watch, onMounted, onUnmounted, toRaw, watchEffect } from "vue";
import {
  useBnbs,
  useDeleteBnb,
  useEditBnb,
  useAddBnb,
} from "../../../feature-data-access-api/bnb";
import { useUser } from "../../../feature-data-access-api/auth";
import { BnbType } from "../../../utils/types/bnb";
import { useField, useForm } from "vee-validate";
import { IconAdd, IconDelete, IconEdit } from "../../../utils/icons";

const { data: bnbs } = useBnbs();
const { mutate: deleteBnb } = useDeleteBnb();
const { mutate: editBnb, isSuccess: isSuccessEdit, isPending } = useEditBnb();
const { mutate: addBnb, isSuccess: isSuccessAdd } = useAddBnb();
const { data: myUserData } = useUser();

const myBnbs = ref<BnbType[]>([]);
watchEffect(() => {
  if (bnbs.value && myUserData.value) {
    myBnbs.value = toRaw(bnbs.value).filter(
      (bnb: BnbType) => bnb.user_id === myUserData.value.id
    );
  }
});

const editedBnb = ref<BnbType | null>(null);

const { resetForm: resetEdit } = useForm();
const { resetForm: resetAdd } = useForm();

const { value: addressFieldAdd, setValue: setAddressFieldAdd } =
  useField("address_add");
const { value: spaceFieldAdd, setValue: setSpaceFieldAdd } =
  useField("space_add");
const { value: costFieldAdd, setValue: setCostFieldAdd } = useField("cost_add");

watch(addressFieldAdd, (newValue) => {
  setAddressFieldAdd(newValue);
});
watch(spaceFieldAdd, (newValue) => {
  setSpaceFieldAdd(newValue);
});
watch(costFieldAdd, (newValue) => {
  setCostFieldAdd(newValue);
});

const { value: addressFieldEdit, setValue: setAddressFieldEdit } =
  useField("address_edit");
const { value: spaceFieldEdit, setValue: setSpaceFieldEdit } =
  useField("space_edit");
const { value: costFieldEdit, setValue: setCostFieldEdit } =
  useField("cost_edit");

watch(addressFieldEdit, (newValue) => {
  setAddressFieldEdit(newValue);
});
watch(spaceFieldEdit, (newValue) => {
  setSpaceFieldEdit(newValue);
});
watch(costFieldEdit, (newValue) => {
  setCostFieldEdit(newValue);
});

const handleDeleteBnb = async (bnb: BnbType) => {
  await deleteBnb(String(bnb?._id));
};

const handleStartEditBnb = (bnb: BnbType) => {
  editedBnb.value = bnb;
  setAddressFieldEdit(bnb?.address || '');
  setSpaceFieldEdit(bnb?.space || '');
  setCostFieldEdit(bnb?.cost || '');
};

const isEditBnbFormEmpty = () => {
  return (
    !addressFieldEdit.value && !spaceFieldEdit.value && !costFieldEdit.value
  );
};

const submitEditBnb = async () => {
  if (isEditBnbFormEmpty()) return;

  if (editedBnb.value?._id) {
    await editBnb({
      ...editedBnb.value,
      id: editedBnb.value._id,
      address: addressFieldEdit.value || editedBnb.value?.address,
      space: spaceFieldEdit.value || editedBnb.value?.space,
      cost: costFieldEdit.value || editedBnb.value?.cost,
    });
  }
};

const isAddBnbFormEmpty = () => {
  return !addressFieldAdd.value || !spaceFieldAdd.value || !costFieldAdd.value;
};

const submitAddBnb = async () => {
  if (isAddBnbFormEmpty()) return;

  await addBnb({
    address: addressFieldAdd?.value,
    space: spaceFieldAdd?.value,
    cost: costFieldAdd?.value,
    user_id: myUserData.value?.id,
  });
};

watch([isSuccessEdit, isSuccessAdd], ([isSuccessEdit, isSuccessAdd]) => {
  if (isSuccessEdit) {
    resetEdit();
    editedBnb.value = null;
  }
  if (isSuccessAdd) {
    resetAdd();
  }
});

const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === "Escape") {
    editedBnb.value = null;
  }
};

onMounted(() => {
  window.addEventListener("keydown", handleKeyDown);
});

onUnmounted(() => {
  window.removeEventListener("keydown", handleKeyDown);
});
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
    <p :class="styles.heading">My Hotels</p>
    <div class="flex flex-col space-y-2 pt-5">
      <form
        v-for="(bnb, index) in myBnbs"
        :key="index"
        @submit.prevent="submitEditBnb"
      >
        <div
          :class="[
            'grid gap-2 grid-cols-[5fr_1fr] place-items-center justify-items-end',
            index !== myBnbs?.length - 1 ? 'border-b border-stone-200' : '',
          ]"
        >
          <div class="py-1 grid gap-2 grid-cols-[4fr_2fr_2fr_2fr] w-full">
            <div class="flex flex-col">
              <p :class="[styles.paragraph2, 'text-stone-400']">Address</p>
              <p v-if="editedBnb?._id !== bnb._id" :class="styles.paragraph">
                {{ bnb?.address }}
              </p>
              <InputControl v-else name="address_edit" class="pb-2" />
            </div>
            <div class="flex flex-col">
              <p :class="[styles.paragraph2, 'text-stone-400']">Space</p>
              <p v-if="editedBnb?._id !== bnb._id" :class="styles.paragraph">
                {{ bnb?.space }} m<sup>2</sup>
              </p>
              <InputControl v-else name="space_edit" class="pb-2" />
            </div>
            <div class="flex flex-col">
              <p :class="[styles.paragraph2, 'text-stone-400']">Cost</p>
              <p v-if="editedBnb?._id !== bnb._id" :class="styles.paragraph">
                {{ bnb?.cost }} pln/night
              </p>
              <InputControl v-else name="cost_edit" class="pb-2" />
            </div>
            <div v-if="editedBnb?._id !== bnb._id" class="flex flex-col">
              <p :class="[styles.paragraph2, 'text-stone-400']">Updated</p>
              <p :class="styles.paragraph">
                {{ moment(bnb?.updatedAt).fromNow() }}
              </p>
            </div>
          </div>
          <div
            v-if="editedBnb?._id !== bnb._id"
            class="flex gap-2.5 text-primary pt-2"
          >
            <button @click="handleStartEditBnb(bnb)">
              <IconEdit />
            </button>
            <button @click="handleDeleteBnb(bnb)">
              <IconDelete />
            </button>
          </div>
          <div v-else>
            <Button :disabled="isEditBnbFormEmpty()" :isLoading="isPending">
              Save
            </Button>
          </div>
        </div>
      </form>
    </div>
    <form
      @submit.prevent="submitAddBnb"
      class="grid grid-cols-[5fr_1fr] place-items-center justify-items-end"
    >
      <div class="py-1 grid gap-2 grid-cols-[4fr_2fr_2fr] w-full">
        <div class="flex flex-col">
          <p :class="[styles.paragraph2, 'text-stone-400']">Address</p>
          <InputControl name="address_add" class="pb-2" />
        </div>
        <div class="flex flex-col">
          <p :class="[styles.paragraph2, 'text-stone-400']">Space</p>
          <InputControl name="space_add" class="pb-2" />
        </div>
        <div class="flex flex-col">
          <p :class="[styles.paragraph2, 'text-stone-400']">Cost</p>
          <InputControl name="cost_add" class="pb-2" />
        </div>
      </div>
      <button
        type="submit"
        class="text-primary hover:opacity-80"
        :title="isAddBnbFormEmpty() ? 'First fill all fields' : undefined"
      >
        <IconAdd />
      </button>
    </form>
  </div>
</template>
