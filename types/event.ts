export type EventType =
  | "sunday-service"
  | "special"
  | "retreat"
  | "prayer"
  | "youth"
  | "community";

export interface ChurchEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  endTime?: string;
  location: string;
  type: EventType;
  imageUrl?: string;
  isRecurring?: boolean;
  registrationUrl?: string;
}
