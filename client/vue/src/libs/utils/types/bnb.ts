export type BnbType = {
  _id: number;
  id: number;
  user_id: number;
  address: string;
  space: number;
  cost: number;
  updatedAt: string;
  createdAt: string;
};

export type AddBnbType = {
  address: string;
  space: number;
  cost: number;
  user_id: number;
};

export type BnbsSearchType = {
  min_cost?: number;
  max_cost?: number;
  min_space?: number;
  max_space?: number;
  address_like?: string;
};

export type DateRangeType = {
  start: Date;
  end: Date;
}