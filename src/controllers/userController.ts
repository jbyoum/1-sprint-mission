import { create } from 'superstruct';
import userService from '../services/userService';
import { IdParamsStruct } from '../structs/commonStructs';
import {
  CreatePasswordStruct,
  CreateUserBodyStruct,
  UpdateUserBodyStruct,
} from '../structs/userStructs';
import { Request, Response } from 'express';
import { UserWithId } from '../../types/user-with-id';
import { NONE_STRING, REFRESH_STRING, REFRESH_tOKEN_STRING } from '../config/constants';
import notificationService from '../services/notificationService';

/**
 * @openapi
 * /users/signup:
 *   post:
 *     summary: 사용자 회원가입
 *     description: 새로운 사용자를 생성합니다.
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: 사용자 이메일
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 description: 사용자 비밀번호
 *                 example: "password123"
 *               name:
 *                 type: string
 *                 description: 사용자 이름
 *                 example: "John Doe"
 *     responses:
 *       201:
 *         description: 사용자 생성 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: 잘못된 요청. 입력 데이터가 유효하지 않습니다.
 */
export async function createUser(req: Request, res: Response) {
  const data = create(req.body, CreateUserBodyStruct);
  const user = await userService.createUser(data);
  res.status(201).send(user);
}

/**
 * @openapi
 * /users/login:
 *   post:
 *     summary: 사용자 로그인
 *     description: 사용자가 이메일과 비밀번호를 통해 로그인합니다.
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: 사용자 이메일
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 description: 사용자 비밀번호
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: 로그인 성공. 액세스 토큰을 반환합니다.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   description: 액세스 토큰
 *                   example: "eyJhbGciOiJIUzI1NiIsInR..."
 *       401:
 *         description: 인증 실패. 이메일 또는 비밀번호가 잘못되었습니다.
 */
export async function login(req: Request, res: Response) {
  const reqUser = req.user as UserWithId;
  const accessToken = userService.createToken(reqUser);
  const refreshToken = userService.createToken(reqUser, REFRESH_STRING);
  res.cookie(REFRESH_tOKEN_STRING, refreshToken, {
    path: '/users/token/refresh',
    httpOnly: true,
    sameSite: NONE_STRING,
    secure: false,
  });
  res.json({ accessToken });
}

/**
 * @openapi
 * /users/token/refresh:
 *   post:
 *     summary: 토큰 갱신
 *     description: 리프레시 토큰을 사용하여 새로운 액세스 토큰을 발급받습니다.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 토큰 갱신 성공. 새로운 액세스 토큰을 반환합니다.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   description: 새로운 액세스 토큰
 *                   example: "eyJhbGciOiJIUzI1NiIsInR..."
 *       401:
 *         description: 인증 실패. 리프레시 토큰이 유효하지 않습니다.
 */
export async function refreshToken(req: Request, res: Response) {
  const reqUser = req.user as UserWithId;
  const { id: userId } = create({ id: reqUser.id }, IdParamsStruct);
  const { accessToken, newRefreshToken } = await userService.refreshToken(userId);
  res.cookie(REFRESH_tOKEN_STRING, newRefreshToken, {
    path: '/users/token/refresh',
    httpOnly: true,
    sameSite: NONE_STRING,
    secure: false,
  });
  res.json({ accessToken });
}

/**
 * @openapi
 * /users/info:
 *   get:
 *     summary: 사용자 정보 조회
 *     description: 현재 로그인한 사용자의 정보를 조회합니다.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 사용자 정보 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: 인증 실패. 액세스 토큰이 유효하지 않습니다.
 */
export async function getInfo(req: Request, res: Response) {
  const reqUser = req.user as UserWithId;
  const { id: userId } = create({ id: reqUser.id }, IdParamsStruct);
  const user = await userService.getUserById(userId);
  res.send(user);
}

/**
 * @openapi
 * /users/info:
 *   patch:
 *     summary: 사용자 정보 수정
 *     description: 현재 로그인한 사용자의 정보를 수정합니다.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: 수정할 사용자 이름
 *                 example: "Jane Doe"
 *               email:
 *                 type: string
 *                 description: 수정할 사용자 이메일
 *                 example: "jane@example.com"
 *     responses:
 *       200:
 *         description: 사용자 정보 수정 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: 인증 실패. 액세스 토큰이 유효하지 않습니다.
 */
export async function editInfo(req: Request, res: Response) {
  const reqUser = req.user as UserWithId;
  const { id: userId } = create({ id: reqUser.id }, IdParamsStruct);
  const data = create(req.body, UpdateUserBodyStruct);
  const user = await userService.updateUser(userId, data);
  res.status(201).send(user);
}

/**
 * @openapi
 * /users/password:
 *   patch:
 *     summary: 사용자 비밀번호 수정
 *     description: 현재 로그인한 사용자의 비밀번호를 수정합니다.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               oldPassword:
 *                 type: string
 *                 description: 기존 비밀번호
 *                 example: "oldpassword123"
 *               newPassword:
 *                 type: string
 *                 description: 새 비밀번호
 *                 example: "newpassword123"
 *     responses:
 *       200:
 *         description: 비밀번호 수정 성공
 *       401:
 *         description: 인증 실패. 기존 비밀번호가 올바르지 않습니다.
 */
export async function editPassword(req: Request, res: Response) {
  const reqUser = req.user as UserWithId;
  const { id: userId } = create({ id: reqUser.id }, IdParamsStruct);
  const { password: password } = create(req.body, CreatePasswordStruct);
  const user = await userService.updatePassword(userId, password);
  res.status(201).send(user);
}

/**
 * @openapi
 * /users/notifications:
 *   get:
 *     summary: 사용자 알림 조회
 *     description: 현재 로그인한 사용자의 알림 목록을 조회합니다.
 *     tags:
 *       - Notifications
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 알림 목록 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Notification'
 *       401:
 *         description: 인증 실패. 액세스 토큰이 유효하지 않습니다.
 */
export async function getNotifications(req: Request, res: Response) {
  const reqUser = req.user as UserWithId;
  const notifications = await notificationService.getUserNotifications(reqUser.id);
  res.send(notifications);
}
