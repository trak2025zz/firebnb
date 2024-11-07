import moment from "moment";
import { hotelRoom } from "public/assets";
import { styles } from "public/styles";
import { useEffect, useRef, useState } from "react";
import { DateRangePicker } from "react-date-range";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useOnClickOutside } from "usehooks-ts";
import { useBnbs } from "../../../feature-data-access-api/bnb";
import { useCreateReservation } from "../../../feature-data-access-api/reservation";
import { BnbType, BnbsSearchType } from "../../../utils/types";
import { Button } from "../../unauthenticated-app/components/button";
import { HomepageHero, Navbar } from "../components";

export const Homepage = () => {
  const [searchCriteria, setSearchCriteria] = useState<BnbsSearchType>({});
  const [bookMeModalOpen, setBookMeModalOpen] = useState(false);
  const [selectedBnb, setSelectedBnb] = useState<BnbType | null>(null);
  const { data: bnbs } = useBnbs(searchCriteria);
  const { handleSubmit } = useForm();
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const modalRef = useRef(null);
  const {
    mutate: createReservation,
    status,
    isPending: isCreateReservationPending,
  } = useCreateReservation();

  useEffect(() => {
    if (status === "success") {
      setBookMeModalOpen(false);
      toast.success("Reservation created successfully!");
      setSelectedBnb(null);
      setStartDate(new Date());
      setEndDate(new Date());
    } else if (status === "error") {
      toast.error("Creating reservation error!");
    }
  }, [status]);

  const onSubmit = async () => {
    if (!selectedBnb) return;
    await createReservation({
      start_date: startDate.toISOString().split("T")[0],
      end_date: endDate.toISOString().split("T")[0],
      bnb_id: String(selectedBnb._id),
    });
  };

  const handleSearch = (searchParams: BnbsSearchType) => {
    setSearchCriteria(searchParams);
  };

  const handleBookMeClicked = (bnb: BnbType) => {
    setBookMeModalOpen(true);
    setSelectedBnb(bnb);
  };

  useOnClickOutside(modalRef, () => {
    setBookMeModalOpen(false);
  });

  const handleSelect = (date) => {
    setStartDate(date.selection.startDate);
    setEndDate(date.selection.endDate);
  };

  const selectionRange = {
    startDate: startDate,
    endDate: endDate,
    key: "selection",
  };

  return (
    <>
      <div className="relative bg-black">
        <Navbar />
        <HomepageHero onSearch={handleSearch} />
        <img
          src={hotelRoom}
          className="w-screen h-screen object-cover object-bottom opacity-50"
        />
      </div>
      <div className="bg-white p-5 md:p-10">
        <p className={styles.heading}>All Hotels</p>
        <div className="flex flex-col space-y-2 pt-5">
          {bnbs?.map((bnb: BnbType, index: number) => (
            <div
              key={index}
              className={`grid gap-2 grid-cols-[5fr_1fr] place-items-center justify-items-end ${
                index !== bnbs?.length - 1 && "border-b border-stone-200"
              }`}
            >
              <div className="py-1 grid gap-2 grid-cols-[4fr_2fr_2fr_2fr] w-full">
                <div className="flex flex-col">
                  <p className={`${styles.paragraph2} text-stone-400`}>
                    Address
                  </p>
                  <p className={styles.paragraph}>{bnb?.address}</p>
                </div>
                <div className="flex flex-col">
                  <p className={`${styles.paragraph2} text-stone-400`}>Space</p>
                  <p className={styles.paragraph}>
                    {bnb?.space} m<sup>2</sup>
                  </p>
                </div>
                <div className="flex flex-col">
                  <p className={`${styles.paragraph2} text-stone-400`}>Cost</p>
                  <p className={styles.paragraph}>{bnb?.cost} pln/night</p>
                </div>
                <div className="flex flex-col">
                  <p className={`${styles.paragraph2} text-stone-400`}>
                    Updated
                  </p>
                  <p className={styles.paragraph}>
                    {moment(bnb?.updatedAt).fromNow()}
                  </p>
                </div>
              </div>
              <Button
                variant="primary-inverted"
                onClick={() => handleBookMeClicked(bnb)}
              >
                Book me!
              </Button>
            </div>
          ))}
          {bookMeModalOpen && (
            <div
              ref={modalRef}
              className="p-5 bg-white rounded-lg fixed z-20 top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2 shadow-background"
            >
              <p className={`${styles.heading} pb-2.5`}>Create reservation</p>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col space-y-2.5">
                  <p className={styles.paragraph2}>Date (start/end)</p>
                  <DateRangePicker
                    date={new Date()}
                    minDate={new Date()}
                    maxDate={
                      new Date(new Date().setDate(new Date().getDate() + 90))
                    }
                    ranges={[selectionRange]}
                    onChange={handleSelect}
                    rangeColors={["#FF5A5F"]}
                  />
                  <Button isLoading={isCreateReservationPending}>
                    Confirm reservation
                  </Button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

