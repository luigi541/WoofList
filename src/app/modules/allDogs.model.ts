export interface Image {
  id: string;
  width: number;
  height: number;
  url: string;
}

export interface AllDogs {
  id: number;
  name: string;
  bred_for: string;
  breed_group: string;
  life_span: string;
  temperament: string;
  origin: string;
  relatedIds: number[];
  image: Image;
}
