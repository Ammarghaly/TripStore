export interface Iproduct {
relatedProducts: Iproduct[];
mainProduct: Iproduct;
  id:number,
  name:string,
  description:string,
  price:number,
  stock:number,
  tripIds:number[],
  imageUrl:string
}