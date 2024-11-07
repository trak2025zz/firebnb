import moment from "moment";
import { hotelRoom } from "public/assets";
import { styles } from "public/styles";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useUser } from "../../../feature-data-access-api/auth";
import {
  useAddBnb,
  useBnbs,
  useDeleteBnb,
  useEditBnb,
} from "../../../feature-data-access-api/bnb";
import { IconAdd, IconDelete, IconEdit } from "../../../utils/icons";
import { BnbType } from "../../../utils/types";
import { Button } from "../../unauthenticated-app/components/button";
import { InputControl } from "../../unauthenticated-app/components/input-control";
import { Navbar } from "../components";

export const MyHotels = () => {
  const { data: bnbs } = useBnbs();
  const { mutate: deleteBnb } = useDeleteBnb();
  const { mutate: editBnb, isSuccess: isSuccessEdit, isPending } = useEditBnb();
  const { mutate: addBnb, isSuccess: isSuccessAdd } = useAddBnb();
  const { data: myUserData } = useUser();
  const myBnbs = bnbs?.filter(
    (bnb: BnbType) => bnb?.user_id === myUserData?.id
  );
  const [editedBnb, setEditedBnb] = useState<BnbType | null>(null);
  const {
    control: controlEdit,
    handleSubmit: handleSubmitEdit,
    watch: watchEdit,
    reset: resetEdit,
  } = useForm();
  const {
    control: controlAdd,
    handleSubmit: handleSubmitAdd,
    watch: watchAdd,
    reset: resetAdd,
  } = useForm();

  const valuesEditBnb = watchEdit();
  const valuesAddBnb = watchAdd();

  const handleDeleteBnb = async (bnb: BnbType) => {
    await deleteBnb(String(bnb?._id));
  };

  const handleStartEditBnb = (bnb: BnbType) => {
    setEditedBnb(bnb);
    resetEdit({
      address: bnb?.address,
      space: bnb?.space,
      cost: bnb?.cost,
    });
  };

  const isEditBnbFormEmpty = () => {
    return (
      !valuesEditBnb.address && !valuesEditBnb.space && !valuesEditBnb.cost
    );
  };

  const onEditBnb = async () => {
    if (isEditBnbFormEmpty()) return;

    if (editedBnb?._id) {
      await editBnb({
        ...editedBnb,
        id: editedBnb._id,
        address: valuesEditBnb?.address || editedBnb?.address,
        space: valuesEditBnb?.space || editedBnb?.space,
        cost: valuesEditBnb?.cost || editedBnb?.cost,
      });
    }
  };

  const isAddBnbFormEmpty = () => {
    return !valuesAddBnb.address || !valuesAddBnb.space || !valuesAddBnb.cost;
  };

  const onAddBnb = async () => {
    if (isAddBnbFormEmpty()) return;

    await addBnb({
      address: valuesAddBnb?.address,
      space: valuesAddBnb?.space,
      cost: valuesAddBnb?.cost,
      user_id: myUserData?.id,
    });
  };

  useEffect(() => {
    if (isSuccessEdit) {
      resetEdit();
      setEditedBnb(null);
    }
    if (isSuccessAdd) {
      resetAdd();
    }
  }, [isSuccessEdit, isSuccessAdd]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setEditedBnb(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <>
      <div className="relative bg-black">
        <Navbar />
        <img
          src={hotelRoom}
          className="w-screen  h-24 md:h-[7.5rem] object-cover object-center opacity-50"
        />
      </div>
      <div className="bg-white p-5 md:p-10">
        <p className={styles.heading}>My Hotels</p>
        <div className="flex flex-col space-y-2 pt-5">
          {myBnbs?.map((bnb: BnbType, index: number) => (
            <form key={index} onSubmit={handleSubmitEdit(onEditBnb)}>
              <div
                className={`grid gap-2 grid-cols-[5fr_1fr] place-items-center justify-items-end ${
                  index !== myBnbs?.length - 1 && "border-b border-stone-200"
                }`}
              >
                <div className="py-1 grid gap-2 grid-cols-[4fr_2fr_2fr_2fr] w-full">
                  <div className="flex flex-col">
                    <p className={`${styles.paragraph2} text-stone-400`}>
                      Address
                    </p>
                    {editedBnb?._id !== bnb?._id ? (
                      <p className={styles.paragraph}>{bnb?.address}</p>
                    ) : (
                      <InputControl
                        fieldErrorMessage={false}
                        control={controlEdit}
                        name="address"
                        className="pb-2"
                      />
                    )}
                  </div>
                  <div className="flex flex-col">
                    <p className={`${styles.paragraph2} text-stone-400`}>
                      Space
                    </p>
                    {editedBnb?._id !== bnb?._id ? (
                      <p className={styles.paragraph}>
                        {bnb?.space} m<sup>2</sup>
                      </p>
                    ) : (
                      <InputControl
                        fieldErrorMessage={false}
                        control={controlEdit}
                        name="space"
                        className="pb-2"
                      />
                    )}
                  </div>
                  <div className="flex flex-col">
                    <p className={`${styles.paragraph2} text-stone-400`}>
                      Cost
                    </p>
                    {editedBnb?._id !== bnb?._id ? (
                      <p className={styles.paragraph}>{bnb?.cost} pln/night</p>
                    ) : (
                      <InputControl
                        fieldErrorMessage={false}
                        control={controlEdit}
                        name="cost"
                        className="pb-2"
                      />
                    )}
                  </div>
                  {editedBnb?._id !== bnb?._id && (
                    <div className="flex flex-col">
                      <p className={`${styles.paragraph2} text-stone-400`}>
                        Updated
                      </p>
                      <p className={styles.paragraph}>
                        {moment(bnb?.updatedAt).fromNow()}
                      </p>
                    </div>
                  )}
                </div>
                {editedBnb?._id !== bnb?._id ? (
                  <div className="flex gap-2.5 text-primary pt-2">
                    <button onClick={() => handleStartEditBnb(bnb)}>
                      <IconEdit />
                    </button>
                    <button onClick={() => handleDeleteBnb(bnb)}>
                      <IconDelete />
                    </button>
                  </div>
                ) : (
                  <Button disabled={isEditBnbFormEmpty()} isLoading={isPending}>
                    Save
                  </Button>
                )}
              </div>
            </form>
          ))}
        </div>
        <form
          onSubmit={handleSubmitAdd(onAddBnb)}
          className="grid grid-cols-[5fr_1fr] place-items-center justify-items-end"
        >
          <div className="py-1 grid gap-2 grid-cols-[4fr_2fr_2fr] w-full">
            <div className="flex flex-col">
              <p className={`${styles.paragraph2} text-stone-400`}>Address</p>
              <InputControl
                fieldErrorMessage={false}
                control={controlAdd}
                name="address"
                className="pb-2"
              />
            </div>
            <div className="flex flex-col">
              <p className={`${styles.paragraph2} text-stone-400`}>Space</p>
              <InputControl
                fieldErrorMessage={false}
                control={controlAdd}
                name="space"
                className="pb-2"
              />
            </div>
            <div className="flex flex-col">
              <p className={`${styles.paragraph2} text-stone-400`}>Cost</p>
              <InputControl
                fieldErrorMessage={false}
                control={controlAdd}
                name="cost"
                className="pb-2"
              />
            </div>
          </div>
          <button
            type="submit"
            className="text-primary hover:opacity-80"
            title={isAddBnbFormEmpty() ? "First fill all fields" : undefined}
          >
            <IconAdd />
          </button>
        </form>
      </div>
    </>
  );
};
