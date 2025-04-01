import { coerce, nonempty, optional, object, partial, string } from 'superstruct';
import { PageParamsStruct } from './commonStructs';

export const GetArticleListParamsStruct = PageParamsStruct;

export const CreateArticleBodyStruct = object({
  title: coerce(nonempty(string()), string(), (value) => value.trim()),
  content: nonempty(string()),
  image: optional(string()),
});

export const UpdateArticleBodyStruct = partial(CreateArticleBodyStruct);
