// eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/no-namespace
declare namespace APIDormitory {
  type StayCategory = {
    id: number;
    name: string;
    is_temp: number;
  };

  type BuildingOnline = {
    id?: number;
    name?: string;
    is_public?: number;
  };

  type FloorOnline = {
    id?: number;
    name?: string;
    is_public?: number;
  };

  type RoomOnline = {
    id?: number;
    name?: string;
    is_public?: number;
  };

  type BedOnline = {
    id?: number;
    name?: string;
    is_public?: number;
  };

  type TypeOnline = {
    id?: number;
    name?: string;
    beds?: { id?: number; name?: string }[];
  };
}
