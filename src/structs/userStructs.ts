import { nonempty, optional, object, partial, string, pattern } from 'superstruct';
import { PageParamsStruct } from './commonStructs';

const emailPattern = pattern(
  string(),
  /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i,
);

export const GetListParamsStruct = PageParamsStruct;

export const CreatePasswordStruct = object({
  password: string(),
});

export const CreateUserBodyStruct = object({
  email: emailPattern,
  nickname: nonempty(string()),
  image: optional(string()),
  password: nonempty(string()),
});

export const UpdateUserBodyStruct = partial(CreateUserBodyStruct);
