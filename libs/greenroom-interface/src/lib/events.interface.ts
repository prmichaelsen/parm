
export const Event = 'event';
export const Slot = 'slot';
export const Comic = 'comic';

export interface Comic {
  _type: 'comic';
  firstName: string;
  lastName: string;
  order: number | null;
}

export interface Slot {
  _type: 'slot';
  comics: Comic[];
  order: number;
};

export interface Event {
  _type: 'event';
  date: string;
  place: string;
  slots: Slot[] ;
}