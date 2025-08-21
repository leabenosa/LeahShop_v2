export type RootStackParamList = {
  ProductList: undefined;
  ProductDetails: {
    id: number;
    name: string;
    category: string;
    price: number;
    description: string;
    imageUri?: string;
  };
  Cart: undefined;
};
