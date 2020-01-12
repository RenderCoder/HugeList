interface Cell {
  categoryName: string;
  productName: string;
  price: string;
  quantity: string;
  imageFile: string;
  valid?: boolean;
  key?: number;
  position?: {
    start: number;
    length: number;
  };
}