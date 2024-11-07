import { BnbType } from "./bnb";

export type ReservationInfoType = {
  start_date: string;
  end_date: string;
  bnb_id: string;
};

export type ReservationType = {
  bnb: BnbType;
  id: string;
  startDate: string;
  endDate: string;
  bnbId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
};
