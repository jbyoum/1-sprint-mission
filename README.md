
## 주요 변경사항
- 이미지 유효성을 위한 mime type 검증

## 배포 링크
https://one-sprint-mission.onrender.com

## API /products /articles
### /
- get
query parameter : offset = 0, limit = 10, order, title = "", content = ""
order : "recent" -> desc, else -> asc
title, content : search keyword

- post

### /:id
- get
- patch
- delete

### /comment
- get
query parameter : limit = 10, cursorId
cursorId : specific comment ID before the first record of results

### /comment/:id
- post
- patch
- delete

## API /upload
- get
return upload webpage

## API /download
### /[specific file path]
- get
return file

## 멘토에게
- 감사합니다. 
