import React from 'react';
import { Pagination } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';

import * as Context from '../../context';

export const PostPagination = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    page_size,
    postCnt,
    // setPostCnt,fetchPostCnt,
    active,
    setActive,
  } = Context.usePostContext();
  const jumpToPage = (page) => {
    // console.log('Jump to page:', page);
    if (page - 1 !== active) {
      const queryParams = new URLSearchParams(location.search);
      console.log(queryParams.toString());
      // queryParams.set('page', page);
      navigate({
        pathname: location.pathname,
        search: queryParams.toString(),
      });
      setActive(page - 1);
    }
  };
  // const getCurrentPage = () => {
  //     const queryParams = new URLSearchParams();
  //     const curPage = 1;
  //     if(queryParams.has('page'))curPage= queryParams.get("page")
  //     console.log("Current page:",curPage);
  //     return curPage;
  // }
  console.log('Post count:', postCnt);
  const pageCnt = Math.floor(postCnt / page_size) + 1;
  // const offset = 2
  const lower = active - 2 < 0 ? 0 : active - 2;
  const upper = active + 2 >= pageCnt ? pageCnt - 1 : active + 2;
  const items = [];
  for (let i = lower; i <= upper; i++) {
    items.push(
      <Pagination.Item key={i} active={active === i} onClick={() => jumpToPage(i + 1)}>
        {i + 1}
      </Pagination.Item>
    );
  }

  return (
    <div className=" w-100 d-flex flex-row justify-content-center p-2">
      <Pagination className="">
        <Pagination.First onClick={() => jumpToPage(1)} />
        <Pagination.Prev onClick={() => jumpToPage(((active - 1 + pageCnt) % pageCnt) + 1)} />
        {items}
        <Pagination.Next onClick={() => jumpToPage(((active + 1) % pageCnt) + 1)} />
        <Pagination.Last onClick={() => jumpToPage(pageCnt)} />
      </Pagination>
    </div>
  );
};
