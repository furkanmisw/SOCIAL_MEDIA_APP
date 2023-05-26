import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import { AppDispatch, RootState } from "../redux/store";
import { selectCurrentPost, setBack } from "../redux/postsReducer";
import { useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import { IPost } from "../interfaces/ISlices";
import { Swiper, SwiperSlide } from "swiper/react";
//@ts-ignore
import { Pagination, Navigation } from "swiper";
import { getImages } from "../api/posts";
import PostPopupComments from "./post/PostPopupComments";

const PostPopup = () => {
  const dispatch = useDispatch<AppDispatch>();
  const postid = window.location.pathname.split("/")[2];
  const cp = useSelector((s: RootState) => selectCurrentPost(s, postid))!;
  const close = () => {
    window.history.back();
    dispatch(setBack(null));
  };

  useEffect(() => {
    const worker = (e: PopStateEvent) => dispatch(setBack(null));
    window.addEventListener("popstate", worker);
  }, []);

  return (
    <>
      <Bg onClick={close} />
      <Container>
        <PostPopupImages cp={cp} />
        <PostPopupComments cp={cp} />
      </Container>
    </>
  );
};

const Bg = styled.div`
  background-color: rgba(0, 0, 0, 0.6);
  width: 100vw;
  height: 100vh;
  left: 0px;
  top: 0px;
  position: fixed;
  z-index: 120;
`;

const Container = styled.div`
  @media screen and (max-width: 1164px) {
    left: 2rem !important;
    width: calc(100% - 4rem) !important;
    .cvr,
    .images {
      width: 100%;
      min-width: 500px;
    }
  }

  @media screen and (max-height: 764px) {
    top: 2rem !important;
    height: calc(100% - 4rem) !important;
  }

  background-color: rgba(0, 0, 0, 0.6);
  left: calc(50% - 550px);
  top: calc(50% - 350px);
  max-width: 1100px;
  width: 100%;
  height: 100%;
  max-height: 700px;
  overflow: hidden;
  position: fixed;
  z-index: 150;
  background-color: #000;
  display: flex;
  transform: scale(1.2);
  @keyframes sc {
    from {
      transform: scale(1.2);
    }
    to {
      transform: scale(1);
    }
  }
  animation: sc 0.1s ease-in-out forwards;
  .cvr {
    height: 100%;
    width: 700px;
    min-width: 700px;
    position: relative;
    .layer {
      width: 100%;
      height: 100%;
      position: absolute;
      left: 0px;
      top: 0px;
      z-index: 10;
    }
    .cover {
      width: 100%;
      object-fit: cover;
      height: 100%;
    }
  }
  .swiper {
    height: 100%;
  }
  .images {
    height: 100%;
    width: 700px;
    position: relative;
    img {
      width: 100%;
      object-fit: cover;
      height: 100%;
      max-width: 700px;
    }
    .layer {
      position: absolute;
      left: 0px;
      top: 0px;
      width: 100%;
      height: 100%;
    }
  }
`;

const PostPopupImages = ({ cp }: { cp: IPost }) => {
  const dispach = useDispatch<AppDispatch>();
  const { images, cover, more, id } = cp;
  useEffect(() => {
    if (more && !images) dispach(getImages(id));
  }, [cp]);

  if (!images)
    return (
      <div className="cvr">
        <img className="cover" src={cover} alt="cover" />
        <div className="layer"></div>
      </div>
    );

  return (
    <div className="images">
      <Swiper
        slidesPerView={1}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        modules={[Pagination, Navigation]}
        className="mySwiper"
      >
        {images.map((img, index) => {
          return (
            <SwiperSlide>
              <img src={img} alt={index.toString()} />
              <div className="layer"></div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};
export default PostPopup;