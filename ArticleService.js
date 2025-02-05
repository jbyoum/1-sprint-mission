import axios from "axios";

const instance = axios.create({
  baseURL: "https://panda-market-api-crud.vercel.app/",
});
const ArticleService = {};
ArticleService.getArticleList = getArticleList;
ArticleService.getArticle = getArticle;
ArticleService.createArticle = createArticle;
ArticleService.patchArticle = patchArticle;
ArticleService.deleteArticle = deleteArticle;

function getArticleList(page = 1, pageSize = 10, keyword = "keyword") {
  return new Promise((resolve) => {
    instance
      .get("articles", page, pageSize, keyword)
      .then((res) => {
        if (parseInt(res.status / 100) != 2) {
          throw new Error(res);
        } else {
          // console.log(res.data["list"]);
        }
        resolve(res.data["list"]);
      })
      .catch((err) => {
        console.log(err);
      });
  });
}

function getArticle(id) {
  return new Promise((resolve) => {
    instance
      .get(`articles/${id}`)
      .then((res) => {
        if (parseInt(res.status / 100) != 2) {
          throw new Error(res);
        } else {
          console.log(res.data);
          resolve(res.data);
        }
      })
      .catch((err) => {
        console.log(err);
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
        if (parseInt(res.status / 100) != 2) {
          throw new Error(res);
        } else {
          console.log(res.data);
          resolve(res.data);
        }
      })
      .catch((err) => {
        console.log(err);
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
        if (parseInt(res.status / 100) != 2) {
          throw new Error(res);
        } else {
          console.log(res.data);
          resolve(res.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  });
}

function deleteArticle(id) {
  return new Promise((resolve) => {
    instance
      .delete(`articles/${id}`)
      .then((res) => {
        if (parseInt(res.status / 100) != 2) {
          throw new Error(res);
        } else {
          console.log(res.data);
          resolve(res.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  });
}

export default ArticleService;
