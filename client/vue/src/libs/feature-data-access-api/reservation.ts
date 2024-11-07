import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";
import { toast } from "vue3-toastify";
import { ReservationInfoType } from "../utils/types/reservation";
import { client } from "./utils";

export function useCreateReservation() {
  return useMutation({
    mutationFn: (reservationInfo: ReservationInfoType) =>
      client("reservation/create", {
        method: "POST",
        data: reservationInfo,
      }),
  });
}

export function useUserReservations() {
  return useQuery({
    queryKey: ["user-reservations"],
    queryFn: () => client("reservation/list/user"),
  });
}

export function useDeleteReservation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reservationId: string) =>
      client(`reservation/delete/${reservationId}`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-reservations"] });
      toast.success("Reservation deleted successfully");
    },
  });
}
