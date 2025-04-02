export class ProductWithLikeDTO {
  id!: number;
  name!: string;
  description!: string;
  price!: number;
  tags!: string[];
  images!: string[];
  createdAt!: Date;
  updatedAt!: Date;
  userId!: number;
  isLiked: boolean;

  constructor(
    product: {
      id: number;
      name: string;
      description: string;
      price: number;
      tags: string[];
      images: string[];
      createdAt: Date;
      updatedAt: Date;
      userId: number;
    },
    isLiked: Object | null,
  ) {
    Object.assign(this, product);
    this.isLiked = !!isLiked;
  }
}

export class ProductListWithCountDTO {
  list!: {
    id: number;
    name: string;
    description: string;
    price: number;
    tags: string[];
    images: string[];
    createdAt: Date;
    updatedAt: Date;
    userId: number;
  }[];
  totalCount!: number;

  constructor(
    products: {
      id: number;
      name: string;
      description: string;
      price: number;
      tags: string[];
      images: string[];
      createdAt: Date;
      updatedAt: Date;
      userId: number;
    }[],
    totalCount: number,
  ) {
    this.list = products;
    this.totalCount = totalCount;
  }
}
