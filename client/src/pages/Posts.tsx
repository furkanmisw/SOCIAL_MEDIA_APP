import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../redux/store.ts";
import { getPosts } from "../api/getPosts.ts";
import { selectLoading, selectPostsHome } from "../redux/postsSlice.ts";
import PostItemHome from "../components/PostItemHome.tsx";
import LoadingBox from "../components/LoadingBox.tsx";
import styled from "styled-components";

const Posts = () => {
  const dispatch = useDispatch<AppDispatch>();

  const posts = useSelector(selectPostsHome);
  const { home: loading } = useSelector(selectLoading);

  useEffect(() => {
    if (posts.length == 0) dispatch(getPosts({}));
  }, []);

  return (
    <Container>
      {posts.map((post) => (
        <PostItemHome post={post} />
      ))}
      {loading && <LoadingBox />}
    </Container>
  );
};
const Container = styled.div`
  height: 100vh;
  overflow-x: hidden;
  width: 100%;
  overflow-y: auto;
  max-width: 450px;
  margin: 2rem;
  display: flex;
  align-items: start;
  flex-direction: column;
  justify-content: start;
  padding: 2rem 0px;
  .loading-box {
    margin: 2rem;
  }
`;

export default Posts;
