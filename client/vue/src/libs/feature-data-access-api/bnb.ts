import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";
import { toast } from "vue3-toastify";
import { AddBnbType, BnbType, BnbsSearchType } from "../utils/types/bnb";
import { client } from "./utils";

async function getBnbs(bnbsList?: BnbsSearchType) {
  let query = "bnb/list?";
  if (bnbsList) {
    const { min_cost, max_cost, min_space, max_space, address_like } = bnbsList;
    if (min_cost) query += `&min_cost=${min_cost}`;
    if (max_cost) query += `&max_cost=${max_cost}`;
    if (min_space) query += `&min_space=${min_space}`;
    if (max_space) query += `&max_space=${max_space}`;
    if (address_like) query += `&address_like=${address_like}`;
  }

  return client(query);
}
export function useBnbs(bnbsList?: BnbsSearchType) {
  return useQuery({
    queryKey: ["bnbs", bnbsList],
    queryFn: () => getBnbs(bnbsList),
  });
}

export function useDeleteBnb() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (bnbId: string) =>
      client(`bnb/delete/${bnbId}`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bnbs"] });
      toast.success("Bnb and related reservations deleted successfully");
    },
  });
}

export function useEditBnb() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (bnb: BnbType) =>
      client("bnb/update", {
        method: "PUT",
        data: bnb,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bnbs"] });
      toast.success("Bnb edited successfully");
    },
    onError: () => {
      toast.error("Bnb edit failed");
    },
  });
}

export function useAddBnb() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (bnb: AddBnbType) =>
      client("bnb/create", {
        method: "POST",
        data: bnb,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bnbs"] });
      toast.success("Bnb added successfully");
    },
    onError: () => {
      toast.error("Bnb add failed");
    },
  });
}
