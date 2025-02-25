## 주요 변경사항

- 이미지 유효성을 위한 mime type 검증

## 배포 링크

https://one-sprint-mission.onrender.com

## API /products /articles

### /

- get<br/>
  query parameter : offset = 0, limit = 10, order, title = "", content = ""<br/>
  order : "recent" -> desc, else -> asc<br/>
  title, content : search keyword

- post

### /:id

- get
- patch
- delete

### /comments

- get<br/>
  query parameter : limit = 10, cursorId<br/>
  cursorId : specific comment ID before the first record of results

### /comment/:id

- post
- patch
- delete

## API /upload

- get<br/>
  return upload webpage

## API /download

### /[specific file path]

- get<br/>
  return file

## 멘토에게

- 감사합니다.
