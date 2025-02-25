import * as ArticleService from "./ArticleService.js";
import * as ProductService from "./ProductService.js";

const timestamp = new Date(Date.now());
const offset = timestamp.getTimezoneOffset();

class Product {
  constructor(
    name = "name",
    description = "description",
    price = 0,
    tags = [],
    images = []
  ) {
    (this.name = name),
      (this.description = description),
      (this.price = price),
      (this.tags = tags),
      (this.images = images),
      (this._favoriteCount = 0);
  }

  getFavorite() {
    return this._favoriteCount;
  }

  favorite() {
    _favoriteCount++;
  }
}

class ElectronicProduct extends Product {
  constructor(
    name = "name",
    description = "description",
    price = 0,
    tags = [],
    images = []
  ) {
    super(name, description, price, tags, images);
    this.manufacturer = "manufacturer";
  }
}

class Article {
  constructor(
    title = "title",
    content = "content",
    writer = "writer",
    image = "imageurl"
  ) {
    (this.title = title),
      (this.content = content),
      (this.writer = writer),
      (this._likeCount = 0),
      (this.image = image);
    this.createdAt = new Date(Date.now() - offset * 60 * 1000);
  }

  like() {
    likeCount++;
  }

  getLikecount() {
    return this._likeCount;
  }
}

const productList = await ProductService.getProductList();
let products = [];
for (let idx in productList) {
  let newElement;
  const element = productList[idx];
  if (element["tags"].includes("전자제품")) {
    newElement = new ElectronicProduct(
      element["name"],
      element["description"],
      element["price"],
      element["tags"],
      element["images"]
    );
  } else {
    newElement = new Product(
      element["name"],
      element["description"],
      element["price"],
      element["tags"],
      element["images"]
    );
  }
  products.push(newElement);
}

let articles = [];
ArticleService.getArticleList()
  .then((articleList) => {
    for (let idx in articleList) {
      const element = articleList[idx];
      const newElement = new Article(
        element["title"],
        element["content"],
        element["writer"],
        element["imageurl"]
      );
      articles.push(newElement);
    }
  })
  .catch((err) => {
    console.error(err);
  });
