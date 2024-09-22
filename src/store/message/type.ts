export interface ListMessageType {
  msg: string;
  code: number;
  data: Datum[];
}

export interface Datum {
  from_id: number;
  to_image: string;
  to_id: number;
  id: number;
  time: Date;
  from_image: string;
  type: number;
  content: string;
}
