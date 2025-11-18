import { Timestamp } from "firebase/firestore";

export type User = {
  id: string;
  name: string;
  email: string;
};

export type LoggedEvent = {
  id: string;
  timestamp: string;
  agent: string;
  description: string;
};
