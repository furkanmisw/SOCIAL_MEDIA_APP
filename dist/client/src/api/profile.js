"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.followRequests = exports.notificationsGet = exports.changePassword = exports.updateProfile = exports.accountDetail = exports.blockUser = exports.followUser = exports.searchProfile = exports.getProfilePosts = exports.getProfile = exports.getMyProfile = void 0;
const toolkit_1 = require("@reduxjs/toolkit");
const req_1 = __importDefault(require("./req"));
exports.getMyProfile = (0, toolkit_1.createAsyncThunk)("/profile/my", () => (0, req_1.default)("/profile/my"));
exports.getProfile = (0, toolkit_1.createAsyncThunk)("/profile/:username", (username) => (0, req_1.default)(`/profile/${username}`));
exports.getProfilePosts = (0, toolkit_1.createAsyncThunk)("/profile/:username/posts", ({ username, date, id }) => (0, req_1.default)(`/profile/${username}/posts?date=${date}&id=${id}`));
const searchProfile = (u) => (0, req_1.default)(`/profile/search?u=${u}`).then((r) => r);
exports.searchProfile = searchProfile;
exports.followUser = (0, toolkit_1.createAsyncThunk)("/profile/:username/follow~{POST|DELETE}", ({ a, userid }) => (0, req_1.default)(`/profile/follow`, a ? "POST" : "DELETE", { userid }).then((r) => r));
exports.blockUser = (0, toolkit_1.createAsyncThunk)("/profile/:username/block~{POST|DELETE}", ({ a, userid }) => (0, req_1.default)(`/profile/block`, a ? "POST" : "DELETE", { userid }));
const accountDetail = () => (0, req_1.default)(`/profile/edit`).then((r) => r);
exports.accountDetail = accountDetail;
const updateProfile = (obj) => (0, req_1.default)(`/profile/edit`, "POST", obj).then((r) => r);
exports.updateProfile = updateProfile;
const changePassword = (op, np, adlo) => (0, req_1.default)(`/auth/password`, "POST", { op, np, adlo });
exports.changePassword = changePassword;
const notificationsGet = ({ date, id }) => (0, req_1.default)(`/profile/notifications?date=${date}&id=${id}`).then((r) => r);
exports.notificationsGet = notificationsGet;
const followRequests = ({ date, id, l }) => (0, req_1.default)(`/profile/requests?date=${date}&id=${id}&l=${l}`).then((r) => r);
exports.followRequests = followRequests;
