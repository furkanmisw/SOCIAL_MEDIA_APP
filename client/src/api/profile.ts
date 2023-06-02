import { createAsyncThunk } from "@reduxjs/toolkit";
import req from "./req";
import { IGetProfilePosts, IFollowUser } from "../interfaces/IApi";

export const getMyProfile = createAsyncThunk("/profile/my", () =>
  req("/profile/my")
);

export const getProfile = createAsyncThunk(
  "/profile/:username",
  (username: string) => req(`/profile/${username}`)
);

export const getProfilePosts = createAsyncThunk(
  "/profile/:username/posts",
  ({ username, date, id }: IGetProfilePosts) =>
    req(`/profile/${username}/posts?date=${date}&id=${id}`)
);

export const searchProfile = (u: string) =>
  req(`/profile/search?u=${u}`).then((r) => r as any);

export const followUser = createAsyncThunk(
  "/profile/:username/follow~{POST|DELETE}",
  ({ a, userid }: IFollowUser) =>
    req(`/profile/follow`, a ? "POST" : "DELETE", { userid }).then(
      (r: any) => r as 0 | 1
    )
);

export const blockUser = createAsyncThunk(
  "/profile/:username/block~{POST|DELETE}",
  ({ a, userid }: IFollowUser) =>
    req(`/profile/block`, a ? "POST" : "DELETE", { userid })
);
