import { createAsyncThunk } from "@reduxjs/toolkit";
import req from "./req";
import {
  IPosts,
  IGetComments,
  ICreateComment,
  ICreateAction,
  ILikeComment,
} from "../interfaces/IApi";
import { IComment, IPost, ISubComment, ILikes } from "../interfaces/ISlices";

export const getPosts = createAsyncThunk(
  "/posts",
  ({ explore, offset, sd }: IPosts) =>
    req(
      `${explore ? `/posts/explore` : `/posts`}?offset=${offset}&sd=${sd}`
    ).then((r) => r as IPost[])
);

export const createPost = (images: string[], content: string | null) =>
  req(`/posts/create`, "POST", { images, content }).then((r) => r as string);

export const getImages = createAsyncThunk(
  "/posts/:postid/images",
  (postid: string) => req(`/posts/${postid}/images`).then((r) => r as string[])
);

export const getComments = createAsyncThunk(
  "/posts/:postid/comments",
  ({ offset, postid, sd, commentid }: IGetComments) =>
    req(
      `/posts/${postid}/comments/${
        commentid ? `${commentid}/subcomments` : ``
      }?offset=${offset}&sd=${sd}`
    ).then((r) => r as (IComment | ISubComment)[])
);

export const createComment = createAsyncThunk(
  "/posts/:postid/comment~{POST}",
  ({ postid, content, commentid }: ICreateComment) =>
    req(
      `/posts/${postid}/${commentid ? `comments/${commentid}` : `comment`}`,
      "POST",
      { content }
    ).then((r) => r as string)
);

export const createAction = createAsyncThunk(
  `/posts/:postid/like~{POST}`,
  ({ a, postid, t }: ICreateAction) =>
    req(`/posts/${postid}/${t}`, a ? "POST" : "DELETE")
);

export const likeComment = createAsyncThunk(
  "/posts/:postid/comments/:commentid/like~{POST}",
  ({ a, commentid, subcommentid, postid }: ILikeComment) =>
    req(
      `/posts/${postid}/comments/${commentid}${
        subcommentid ? `/${subcommentid}` : ""
      }/like`,
      a ? "POST" : "DELETE"
    )
);

export const getPostLikes = ({
  id,
  offset,
  sd,
}: {
  id: string;
  offset: number;
  sd?: string;
}) =>
  req(`/posts/${id}/likes?sd=${sd}&offset=${offset}`).then(
    (r) => r as ILikes[]
  );

export const getCommentLikes = ({
  id,
  offset,
  commentid,
  sd,
}: {
  id: string;
  commentid: string;
  offset: number;
  sd?: string;
}) =>
  req(
    `/posts/${id}/comments/${commentid}/likes?sd=${sd}&offset=${offset}`
  ).then((r) => r as ILikes[]);

export const getSubCommentLikes = ({
  id,
  commentid,
  subcommentid,
  offset,
  sd,
}: {
  id: string;
  commentid: string;
  subcommentid: string;
  offset: number;
  sd?: string;
}) =>
  req(
    `/posts/${id}/likes/comments/${commentid}/${subcommentid}/likes?sd=${sd}&offset=${offset}`
  ).then((r) => r as ILikes[]);
