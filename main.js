import ArticleService from "./ArticleService.js";
import ProductService from "./ProductService.js";

const timestamp = new Date(Date.now());
const offset = timestamp.getTimezoneOffset();

class Product {
  constructor(
    name = "name",
    description = "descrpition",
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
    description = "descrpition",
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
    console.log(this.createdAt);
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
console.log("products[]");
for (let idx in productList) {
  let newElement;
  const element = productList[idx];
  if (element["tags"].includes("전자제품")) {
    newElement = new ElectronicProduct(
      element["name"],
      element["descrpition"],
      element["price"],
      element["tags"],
      element["images"]
    );
  } else {
    newElement = new Product(
      element["name"],
      element["descrpition"],
      element["price"],
      element["tags"],
      element["images"]
    );
  }
  products.push(newElement);
  console.log(newElement);
}

let articles = [];
console.log("articles[]");
ArticleService.getArticleList()
  .then((articleList) => {
    console.log(articleList);
    for (let idx in articleList) {
      const element = articleList[idx];
      const newElement = new Article(
        element["title"],
        element["content"],
        element["writer"],
        element["imageurl"]
      );
      articles.push(newElement);
      console.log(newElement);
    }
  })
  .catch((err) => {
    console.log(err);
  });

// ArticleService 테스트

// ArticleService.getArticleList(); articles[]를 위해 테스트출력제거
// ArticleService.getArticle(14);
// ArticleService.createArticle("타이틀", "컨텐츠", "https://example.com/");
// ArticleService.patchArticle(29, "타틀", "컨츠", "https://example.com/aaaaaaa");
// ArticleService.deleteArticle(29);

// ProductService 테스트

// ProductService.getProductList(); products[]를 위해 테스트출력제거
// ProductService.getProduct(52);
// ProductService.createProduct(
//   "name",
//   "description: description",
//   "tags: tags",
//   ["https://example.com/"]
// );
// ProductService.patchProduct(63, "ne", "desescription", "tagtags", [
//   "https://example.com/",
// ]);
// ProductService.deleteProduct(63);
