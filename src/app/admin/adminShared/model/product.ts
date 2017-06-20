export class Product {
  constructor(
    public name: string,
    public description: string,
    public imgTitle: string,
    public img: any,
    public price: number,
    public imgKey?: string,
    public id?: string
  ){}
}
