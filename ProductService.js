import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://panda-market-api-crud.vercel.app/",
});

async function getProductList(page = 1, pageSize = 10, keyword = "keyword") {
  let res;
  try {
    res = await axiosInstance.get("products", page, pageSize, keyword);
    if (parseInt(res.status) >= 200 && parseInt(res.status) < 300) {
      throw new Error(res);
    }
  } catch (err) {
    console.error(err);
  }
  return res.data["list"];
}

async function getProduct(id) {
  let res;
  try {
    res = await axiosInstance.get(`products/${id}`);
    if (parseInt(res.status) >= 200 && parseInt(res.status) < 300) {
      throw new Error(res);
    }
  } catch (err) {
    console.error(err);
  }
  return res.data;
}

async function createProduct(name, description, price, tags, images) {
  let res;
  try {
    res = await axiosInstance.post("products", {
      images: images,
      tags: tags,
      price: price,
      description: description,
      name: name,
    });
    if (parseInt(res.status) >= 200 && parseInt(res.status) < 300) {
      throw new Error(res);
    }
  } catch (err) {
    console.error(err);
  }
  return res.data;
}

async function patchProduct(id, name, description, price, tags, images) {
  let res;
  try {
    res = await axiosInstance.patch(`products/${id}`, {
      images: images,
      tags: tags,
      price: price,
      description: description,
      name: name,
    });
    if (parseInt(res.status) >= 200 && parseInt(res.status) < 300) {
      throw new Error(res);
    }
  } catch (err) {
    console.error(err);
  }
  return res.data;
}

async function deleteProduct(id) {
  let res;
  try {
    res = await axiosInstance.delete(`products/${id}`);
    if (parseInt(res.status) >= 200 && parseInt(res.status) < 300) {
      throw new Error(res);
    }
  } catch (err) {
    console.error(err);
  }
  return res.data;
}

export default {
  getProductList,
  getProduct,
  createProduct,
  patchProduct,
  deleteProduct,
};
