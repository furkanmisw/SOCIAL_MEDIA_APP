import { findS, io } from "..";
import { destroy } from "../db/cloudinary";
import conv from "../functions/converter";
import urlConverter from "../functions/urlConverter";
import { asyncErrorWrapper, badRequest, createError } from "../mw/error";
import {
  searchProfileQ,
  getMyProfileQ,
  getProfileQ,
  getProfilePostsQ,
  getMySavedQ,
  followUserQ,
  unFollowUserQ,
  blockUserQ,
  unBlockUserQ,
  getMyProfileDetailQ,
  updateProfileQ,
  getMyNotificationsQ,
  getRequestsQ,
  allowRequestQ,
  denyRequestQ,
} from "../queries/profileQ";

const searchProfile = asyncErrorWrapper(async (req, res) => {
  let { u } = req.query;
  const { guest, id } = res.locals;
  if (guest || u == undefined || typeof u != "string" || u.trim().length == 0)
    return badRequest();
  u = u.trim();
  const result = await searchProfileQ(id, u);
  res.json(result);
});

const getMyProfile = asyncErrorWrapper(async (req, res) => {
  const { guest, id } = res.locals;
  if (guest) badRequest();
  const result = await getMyProfileQ(id);
  res.json(result);
});

const getProfile = asyncErrorWrapper(async (req, res) => {
  const { id, guest } = res.locals;
  const { username } = req.params;
  const profile = await getProfileQ(id, username, guest);
  if (profile == null) createError("profile not found", 404);
  res.json(profile);
});

const getProfilePosts = asyncErrorWrapper(async (req, res) => {
  const { id, guest } = res.locals;
  const { username } = req.params;
  const last = conv(req.query);
  const profilePosts = await getProfilePostsQ(id, username, guest, last);
  res.json(profilePosts);
});

const getMySaved = asyncErrorWrapper(async (req, res) => {
  const { id, guest } = res.locals;
  if (guest) badRequest();
  const last = conv(req.query);
  const mySaved = await getMySavedQ(id, last);
  res.json(mySaved);
});

const followUser = asyncErrorWrapper(async (req, res) => {
  const { id, guest } = res.locals;
  const { userid } = req.body;
  if (guest || !userid) badRequest();
  if (userid == id) badRequest();
  const type = await followUserQ(id, userid);
  if (type != undefined) io.to(findS(userid)).emit("notifications", type);

  res.json({ status: "ok" });
});

const unFollowUser = asyncErrorWrapper(async (req, res) => {
  const { id, guest } = res.locals;
  const { userid } = req.body;
  if (guest || !userid) badRequest();
  await unFollowUserQ(id, userid);
  res.json({ status: "ok" });
});

const blockUser = asyncErrorWrapper(async (req, res) => {
  const { id, guest } = res.locals;
  const { userid } = req.body;
  if (guest || !userid) badRequest();
  if (userid == id) badRequest();
  await blockUserQ(id, userid);
  res.json({ status: "ok" });
});

const unBlockUser = asyncErrorWrapper(async (req, res) => {
  const { id, guest } = res.locals;
  const { userid } = req.body;
  if (guest || !userid) badRequest();
  await unBlockUserQ(id, userid);
  res.json({ status: "ok" });
});

const getMyProfileDetail = asyncErrorWrapper(async (req, res) => {
  const { id, guest } = res.locals;
  if (guest) badRequest();
  const detail = await getMyProfileDetailQ(id);
  res.json(detail);
});

const updateProfile = asyncErrorWrapper(async (req, res) => {
  const { id, guest } = res.locals;
  if (guest) badRequest();
  const {
    pp,
    username,
    email,
    fullname,

    bio,
    ispublic,
  } = req.body;
  let values: any = {};
  if (fullname && fullname.length <= 50) values["fullname"] = fullname;
  try {
    if (pp != undefined && pp != null) {
      const url = await urlConverter(id, pp);
      values["pp"] = url;
    } else if (pp == null) {
      values["pp"] = null;
      try {
        await destroy(`${id}-pp`, "pp");
      } catch (error) {}
    }
  } catch (error) {
    return createError((error as any).toString(), 500);
  }

  const newBio = (bio ?? "").replace(/\n{2,}/g, "\n").trim();
  values["bio"] = newBio.length > 0 ? newBio : null;
  values.ispublic = ispublic || false;
  const usernamePattern =
    "^(?=.{6,36}$)(?![_.])(?!.*[_.]{2})[a-z0-9._]+(?<![_.])$";
  if (
    username != undefined &&
    new RegExp(usernamePattern).test(username) &&
    ![
      "explore",
      "accounts",
      "account",
      "myaccount",
      "mysaved",
      "mysaveds",
      "search",
      "myprofile",
    ].includes(username)
  )
    values["username"] = (username as string).toLowerCase();
  if (new RegExp("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$").test(email))
    values["email"] = email;
  await updateProfileQ(id, values);
  res.json(values?.pp || { status: "ok" });
});

const getMyNotifications = asyncErrorWrapper(async (req, res) => {
  const { id, guest } = res.locals;
  if (guest) badRequest();
  const notifications = await getMyNotificationsQ(id, conv(req.query));
  res.json(notifications);
});

const getRequests = asyncErrorWrapper(async (req, res) => {
  const { id, guest } = res.locals;
  if (guest) badRequest();
  const { l } = req.body;

  const requests = await getRequestsQ(id, conv(req.query), l);
  res.json(requests);
});

const allowRequest = asyncErrorWrapper(async (req, res) => {
  const { id, guest } = res.locals;
  const { ri } = req.query;
  if (guest || !ri || typeof ri != "string") return badRequest();

  const owner = await allowRequestQ(id, ri);
  io.to(findS(owner)).emit("notifications", 0);
  res.json({ status: "ok" });
});

const denyRequest = asyncErrorWrapper(async (req, res) => {
  const { id, guest } = res.locals;
  const { ri } = req.query;
  if (guest || !ri || typeof ri != "string") return badRequest();

  await denyRequestQ(id, ri);
  res.json({ status: "ok" });
});

export {
  searchProfile,
  getMyProfile,
  getProfile,
  getProfilePosts,
  getMySaved,
  followUser,
  unFollowUser,
  blockUser,
  unBlockUser,
  getMyProfileDetail,
  updateProfile,
  getMyNotifications,
  getRequests,
  allowRequest,
  denyRequest,
};
