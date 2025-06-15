# 스프린트 미션 5

## 미션 목표

주어진 기본 요구사항과 심화 요구사항을 구현하였습니다.<br/><br/>

<div align="center">
<img src="https://raw.githubusercontent.com/jbyoum/1-sprint-mission/refs/heads/part2-%EC%97%BC%EC%B0%AC%EC%98%81-sprint5/post.png" width="40%" height="40%">
</div>
<br/>
몇 가지 기본적인 기능과 스프린트 미션 4와 비교하여 수정된 부분을 테스트했습니다.

## 수정사항

### - SCHEMA

Like 모델을 게시글과 상품에 대해 분리했습니다.

```prisma
model LikeArticle {
  User      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  userId    Int
  article   Article  @relation(fields: [articleId], references: [id], onDelete: Cascade)
  articleId Int
  createdAt DateTime @default(now())

  @@id([userId, articleId])
}
```

이로써 의도치 않은 Anomaly를 방지할 수 있습니다.<br/>
반면 Comment는 분리하지 않았는데, 그 이유는 일반적으로 자신이 작성한 모든 댓글을 한 눈에 보는 기능을 제공하는 케이스가 많다고 가정하였기 떄문입니다. 이 자주 사용되는 쿼리에 대해 모델이 분리되어 있다면 Join비용, 거기에 검색기능을 추가한다면 두 번의 탐색, 병합비용이 발생합니다. 때문에 Comment는 Anomaly의 위험이 있지만 분리하지 않았습니다.

### - constants.ts

프로젝트 내에서 하드코딩을 최대한 피하고자 가능한 문자열을 대부분 이 파일에 초기화했습니다. 기존 방법대로 사용하는 것이 더 적합한 일부 문자열은 대상에서 제외되었습니다.

### - 일부 기능의 Router 변경

userRouter에 속한 상품 목록을 가져오는 기능이 productRouter로 이동하였습니다.

### - 상품과 게시글의 상세 조회

상세 조회를 비회원도 가능하게 변경하였습니다. 이를 위해 인증에 실패해도 다음 함수를 실행하도록 하는 고차함수를 작성했습니다.

### - 에러 메세지 추가

디버깅 시나리오를 위해 ForbiddenError에 대해 NotFoundError와 같은 메세지를 추가했습니다.<br/>
UnauthError는 메세지를 추가하지 않았는데, 클라이언트의 요청 기능에 따라 상황이 분리되어 있어 충분해 보이고, 클라이언트에 'refresh token이 저장된 값과 다르다', 'serialize 과정에서 오류가 발생했다' 등의 정보는 공격자에게 과한 정보를 주는 것일지도 모른다는 생각이 들었기 때문입니다.

### - DTO

심화 요구사항에 따라 DTO를 구현하였습니다.<br/>
기존의 함수 결과로 바로 응답하는 케이스는 제외하고 추가적으로 데이터 구조를 변경하는 부분에 대해 구성하였습니다.<br/>
Response에 해당하는 부분에 대해서만 구성하고 Request에 해당하는 create 등의 케이스에 대해서는 그러지 않았는데, 이미 Prisma에서 제공하는 타입을 기준으로 Controller --> Service --> Repository 의 데이터 전달이 이루어지고 있었기 때문입니다.

### - Global Type

타입 안정성을 위해 UserWithId 타입을 선언하여 전역으로 활용하였습니다.

```typescript
import { User } from '@prisma/client';
export type UserWithId = { id: number } & Partial<Omit<User, 'id'>>;
```

### - Refresh Token 제외

개발 자료를 참고하며 개발하다 보니 세션 기반 인증을 위한 Refresh Token을 저장하여 비교하는 로직이 포함되어 있었습니다. Refresh Token의 검증은 전략 파일의 JwtStrategy 클래스 생성 시 Passport 내부적으로 진행되기 때문에, 기존 로직은 불필요한 과정입니다.<br/>
User 모델에서 refreshToken 속성을 제거하고, userServie의 refreshToken 함수에서 토큰을 비교하는 로직을 제거했습니다.

### - 그 외

- 일부 잘못 구현되어 있던 로직을 수정했습니다.
- passport.ts 파일을 middlewares로 옮겼습니다.
