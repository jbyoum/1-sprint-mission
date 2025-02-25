import axios from "axios";

const instance = axios.create({
  baseURL: "https://panda-market-api-crud.vercel.app/",
});

function getArticleList(page = 1, pageSize = 10, keyword = "keyword") {
  return new Promise((resolve) => {
    instance
      .get("articles", page, pageSize, keyword)
      .then((res) => {
        if (parseInt(res.status) >= 200 && parseInt(res.status) < 300) {
          throw new Error(res);
        }
        resolve(res.data["list"]);
      })
      .catch((err) => {
        console.error(err);
      });
  });
}

function getArticle(id) {
  return new Promise((resolve) => {
    instance
      .get(`articles/${id}`)
      .then((res) => {
        if (parseInt(res.status) >= 200 && parseInt(res.status) < 300) {
          throw new Error(res);
        }
        resolve(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  });
}

function createArticle(titles, contents, imageurl) {
  return new Promise((resolve) => {
    instance
      .post("articles", {
        image: imageurl,
        content: contents,
        title: titles,
      })
      .then((res) => {
        if (parseInt(res.status) >= 200 && parseInt(res.status) < 300) {
          throw new Error(res);
        }
        resolve(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  });
}

function patchArticle(id, title, content, imageurl) {
  return new Promise((resolve) => {
    instance
      .patch(`articles/${id}`, {
        image: imageurl,
        content: content,
        title: title,
      })
      .then((res) => {
        if (parseInt(res.status) >= 200 && parseInt(res.status) < 300) {
          throw new Error(res);
        }
        resolve(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  });
}

function deleteArticle(id) {
  return new Promise((resolve) => {
    instance
      .delete(`articles/${id}`)
      .then((res) => {
        if (parseInt(res.status) >= 200 && parseInt(res.status) < 300) {
          throw new Error(res);
        }
        resolve(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  });
}

export default {
  getArticleList,
  getArticle,
  createArticle,
  patchArticle,
  deleteArticle,
};
