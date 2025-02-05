import axios from "axios";

const instance = axios.create({
  baseURL: "https://panda-market-api-crud.vercel.app/",
});
const ProductService = {};
ProductService.getProductList = getProductList;
ProductService.getProduct = getProduct;
ProductService.createProduct = createProduct;
ProductService.patchProduct = patchProduct;
ProductService.deleteProduct = deleteProduct;

async function getProductList(page = 1, pageSize = 10, keyword = "keyword") {
  let res;
  try {
    res = await instance.get("products", page, pageSize, keyword);
    if (parseInt(res.status / 100) != 2) {
      throw new Error(res);
    } else {
      // console.log(res.data["list"]);
    }
  } catch (err) {
    console.log(err);
  }
  return res.data["list"];
}

async function getProduct(id) {
  let res;
  try {
    res = await instance.get(`products/${id}`);
    if (parseInt(res.status / 100) != 2) {
      throw new Error(res);
    } else {
      console.log(res.data);
    }
  } catch (err) {
    console.log(err);
  }
  return res.data;
}

async function createProduct(name, description, price, tags, images) {
  let res;
  try {
    res = await instance.post("products", {
      images: images,
      tags: tags,
      price: price,
      description: description,
      name: name,
    });
    if (parseInt(res.status / 100) != 2) {
      throw new Error(res);
    } else {
      console.log(res.data);
    }
  } catch (err) {
    console.log(err);
  }
  return res.data;
}

async function patchProduct(id, name, description, price, tags, images) {
  let res;
  try {
    res = await instance.patch(`products/${id}`, {
      images: images,
      tags: tags,
      price: price,
      description: description,
      name: name,
    });
    if (parseInt(res.status / 100) != 2) {
      throw new Error(res);
    } else {
      console.log(res.data);
    }
  } catch (err) {
    console.log(err);
  }
  return res.data;
}

async function deleteProduct(id) {
  let res;
  try {
    res = await instance.delete(`products/${id}`);
    if (parseInt(res.status / 100) != 2) {
      throw new Error(res);
    } else {
      console.log(res.data);
    }
  } catch (err) {
    console.log(err);
  }
  return res.data;
}

export default ProductService;
