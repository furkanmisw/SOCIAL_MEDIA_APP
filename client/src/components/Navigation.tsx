import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import styled from "styled-components";
import {
  CreatePostPopupIcon,
  ExploreIcon,
  HomeIcon,
  MessagesIcon,
  MoreIcon,
  NotificationsIcon,
  SearchIcon,
} from "./Icons";
import { useSelector } from "react-redux";
import { selectProfileValues } from "../redux/profileSlice";

export const disableRightClick = (
  e: React.MouseEvent<HTMLImageElement, MouseEvent>
) => e.preventDefault();

const Navigation = () => {
  const { username, pp } = useSelector(selectProfileValues);

  const [mini, setMini] = useState(false);
  const { pathname } = useLocation();
  const [panel, setPanel] = useState<null | "search" | "notifications">(null);
  const [createPostPopup, setCreatePostPopup] = useState(false);
  const [moreIconActive, setMoreIconActive] = useState(false);

  const closePanel = () => setPanel(null);

  const uiController = (key: string) => {
    if (createPostPopup) return key == "create";
    if (panel) {
      if (panel == "search") return key == "search";
      if (panel == "notifications") return key == "notifications";
    }
    return key == pathname;
  };

  return (
    <Container className={mini ? "mini" : ""}>
      <div className="content">
        <div className="up">
          <Link to={"/"}>
            <h1>Social Media App</h1>
            <Logo />
          </Link>
        </div>
        <ul>
          <li
            onClick={closePanel}
            className={uiController("/") ? "active" : ""}
          >
            <Link to={"/"}>
              <HomeIcon isactive={uiController("/")} />
              <p>Home</p>
            </Link>
          </li>
          <li className={uiController("search") ? "active" : ""}>
            <div onClick={() => setPanel("search")}>
              <SearchIcon isactive={uiController("search")} />
              <p>Search</p>
            </div>
          </li>
          <li
            onClick={closePanel}
            className={uiController("/explore") ? "active" : ""}
          >
            <Link to={"/explore"}>
              <ExploreIcon isactive={uiController("/explore")} />
              <p>Explore</p>
            </Link>
          </li>
          <li
            onClick={closePanel}
            className={uiController("/direct/inbox") ? "active" : ""}
          >
            <Link to={"/direct/inbox"}>
              <MessagesIcon isactive={uiController("/direct/inbox")} />
              <p>Messages</p>
            </Link>
          </li>
          <li className={uiController("notifications") ? "active" : ""}>
            <div onClick={() => setPanel("notifications")}>
              <NotificationsIcon isactive={uiController("notifications")} />
              <p>Notifications</p>
            </div>
          </li>
          <li className={uiController("create") ? "active" : ""}>
            <div onClick={() => setCreatePostPopup(true)}>
              <CreatePostPopupIcon isactive={uiController("create")} />
              <p>Create</p>
            </div>
          </li>
          <li
            onClick={closePanel}
            className={uiController(`/${username}`) ? "active" : ""}
          >
            <Link to={`/${username}`}>
              <img
                onContextMenu={disableRightClick}
                src={pp || "/pp.jpg"}
                alt="pp"
              />
              <p>Profile</p>
            </Link>
          </li>
        </ul>
        <div className="bottom">
          <button className={moreIconActive ? "active" : ""}>
            <MoreIcon isactive={moreIconActive} />
            <p>More</p>
          </button>
        </div>
      </div>
    </Container>
  );
};

const Container = styled.div`
  height: 100vh;
  width: 360px;
  .content {
    border-right: 1px solid #262626;
    height: 100%;
    width: 100%;
    padding: 8px 12px 20px;
    display: flex;
    min-width: 48px;
    justify-content: space-between;
    flex-direction: column;
    transition: 0.3s ease-in-out width;
    .up {
      display: block;
      padding: 25px 12px 12px;
      width: 100%;
      margin-bottom: 19px;
      height: 74px !important;
      min-height: 74px;
      max-height: 74px;
      h1 {
        font-size: 24px;
        height: 36px;
        display: block;
        width: 100%;
        white-space: nowrap;
        width: 100%;
      }
      .logo {
        display: none;
        animation: scale 0.3s ease-in-out;
        @keyframes scale {
          from {
            transform: scale(0.7);
          }
          to {
            transform: scale(1);
          }
        }
        width: 2rem;
        height: 2rem;
        transition: 0.2s ease transform;
        &:hover {
          transform: scale(1.05);
        }
      }
    }
    ul {
      height: 100%;
      width: 100%;
      li {
        margin: 2px 0px;
        &.active {
          p {
            font-weight: 600;
          }
          img {
            outline: 2px solid #fff;
            outline-offset: 1px;
          }
        }
        a,
        div {
          cursor: pointer;
          border-radius: 8px;
          padding: 12px;
          display: flex;
          align-items: center;
          transition: 0.2s ease all;
          transition-delay: 0.1s;
          svg,
          img {
            min-width: 24px;
            min-height: 24px;
            max-width: 24px;
            max-height: 24px;
            width: 24px;
            height: 24px;
            transition-delay: 0.1s;
            transition: 0.2s ease transform;
          }
          img {
            border-radius: 100%;
          }
          p {
            margin-left: 10px;
          }
          &:hover {
            background-color: rgba(255, 255, 255, 0.12);
            svg {
              transform: scale(1.05);
            }
          }
        }
      }
    }
    .bottom {
      button {
        padding: 12px;
        background-color: transparent;
        display: flex;
        width: 100%;
        position: relative;
        border: none;
        border-radius: 0.5rem;
        outline: none;
        align-items: center;
        &.active {
          p {
            font-weight: 600;
          }
        }
        svg {
          transition: 0.2s ease all;
          transition-delay: 0.1s;
        }
        p {
          font-size: 1rem;
          color: #fafafa;
          margin-left: 10px;
        }
        &:hover {
          background-color: rgba(255, 255, 255, 0.12);
          svg {
            transform: scale(1.05);
          }
        }
      }
    }
  }
  &.mini {
    .content {
      overflow: hidden;
      width: 73px;
      .up {
        h1 {
          display: none;
        }
        .logo {
          display: block !important;
        }
      }
      ul {
        li {
          p {
            display: none;
          }
        }
      }
      .bottom {
        p {
          display: none;
        }
      }
    }
  }
  @media screen and (max-width: 1250px) {
    & {
      width: 73px;
    }
    .content {
      width: 73px;
      .up {
        h1 {
          display: none;
        }
        .logo {
          display: block !important;
        }
      }
      ul {
        li {
          p {
            display: none;
          }
        }
      }
      .bottom {
        p {
          display: none;
        }
      }
    }
  }
`;

const Logo = () => (
  <svg
    className="logo"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="-11.5 -10.23174 23 20.46348"
  >
    <title>React Logo</title>
    <circle cx="0" cy="0" r="2.05" fill="#61dafb" />
    <g stroke="#61dafb" strokeWidth="1" fill="none">
      <ellipse rx="11" ry="4.2" />
      <ellipse rx="11" ry="4.2" transform="rotate(60)" />
      <ellipse rx="11" ry="4.2" transform="rotate(120)" />
    </g>
  </svg>
);

export default Navigation;