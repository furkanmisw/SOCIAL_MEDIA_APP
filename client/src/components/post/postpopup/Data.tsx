import styled from "styled-components";
import LoadingBox from "../../LoadingBox";
import { shallowEqual, useSelector } from "react-redux";
import { selectCurrentPost } from "../../../redux/postsReducer";
import { AppDispatch, RootState } from "../../../redux/store";
import { dateCalc } from "./Bottom";
import { forwardRef, useMemo } from "react";
import { useDispatch } from "react-redux";
import { getComments } from "../../../api/posts";
import LinkConverter from "../LinkConverter";
import LinkQ from "../LinkQ";
import CommentItem from "./CommentItem";
import React, { useImperativeHandle, useRef } from "react";

type Props = {
  reply: (commentid: string, username: string) => void;
};

export type Refs = {
  dataContainerRef: React.MutableRefObject<HTMLUListElement | null>;
  contentRef: React.MutableRefObject<HTMLDivElement | null>;
};

const Data = forwardRef<Refs, Props>(({ reply }, ref) => {
  const dataContainerRef = useRef<HTMLUListElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const dispatch = useDispatch<AppDispatch>();
  const postid = window.location.pathname.split("/")[2];
  const {
    comments: { data, loading, hasmore },
  } = useSelector(selectCurrentPost, shallowEqual)!;
  const onScroll = (e: React.UIEvent<HTMLUListElement, UIEvent>) => {
    const { scrollTop, clientHeight, scrollHeight } =
      e.target as HTMLUListElement;

    if (loading || !hasmore) return;
    if (clientHeight + scrollTop > scrollHeight - 132) {
      dispatch(
        getComments({
          postid,
          offset: data.length,
          sd: data[0].created,
        })
      );
    }
  };

  useImperativeHandle(ref, () => ({
    dataContainerRef,
    contentRef,
  }));

  return (
    <DataContainer ref={dataContainerRef} onScroll={onScroll}>
      <Content ref={contentRef} />
      {data.map((comment) => (
        <CommentItem key={comment.id} comment={comment} reply={reply} />
      ))}
      {loading && <LoadingBox />}
    </DataContainer>
  );
});

const DataContainer = styled.ul`
  height: calc(100% - 147px - 4rem);
  overflow-y: auto;
  &::-webkit-scrollbar {
    display: none;
  }
  .loading-box {
    margin: 1rem 0px;
  }
  .content {
    padding: 1rem;
    display: flex;
    margin-bottom: 1rem;
    .pp {
      margin-right: 18px;
      a {
        width: 2rem;
        height: 2rem;
        display: block;
        &.b {
          font-weight: 400;
          color: #e0f1ff;
        }
        img {
          border-radius: 100%;
          width: 100%;
          height: 100%;
        }
      }
    }
    .text {
      font-size: 14px;
      a {
        margin-right: 4px;
        font-weight: 600;
      }
      p {
        font-size: 12px;
        color: #a8a8a8;
        margin-top: 4px;
      }
    }
  }
`;

const Content = forwardRef<HTMLDivElement>((props, contentRef) => {
  const { pp, username, content, created } = useSelector(
    selectCurrentPost,
    shallowEqual
  )!;

  const date = useMemo(() => dateCalc(created), []);

  return (
    <div ref={contentRef} className="content">
      <div className="pp">
        <LinkQ to={`/${username}`}>
          <img src={pp || "/pp.jpg"} alt="pp" />
        </LinkQ>
      </div>
      <div className="text">
        <pre>
          <LinkQ to={`/${username}`}>{username}</LinkQ>
          <LinkConverter text={content || ""} />
        </pre>
        <p>{date}</p>
      </div>
    </div>
  );
});

export default Data;