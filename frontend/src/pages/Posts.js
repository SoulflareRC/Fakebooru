import React, { useEffect } from 'react';
import { Row } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';

// import api from '../api';



import { SinglePostPage, PostGrid, PostPagination, PostFilter } from '../components/posts';
import * as Tags from '../components/tags';
import { SpinnerPage, Split } from '../components/utils';
import * as Context from '../context';


export const Posts = () => {
  const { loading, setLoading } = Context.useGlobalContext();
  const location = useLocation();
  const navigate = useNavigate();
  const { order, posts, fetchPosts, fetchPostCnt, active, page_size, postTags } =
    Context.usePostContext();
  const { tags, setTags, sortTags, tagifyTags } = Context.useTagContext();
  const queryPosts = async (tags) => {
    const queryParams = new URLSearchParams(location.search);
    queryParams.set('page', 1);
    if (tags.length) {
      tags.forEach((tag) => {
        queryParams.append('tags', tag);
      });
    } else {
      queryParams.delete('tags');
    }
    navigate({
      pathname: location.pathname,
      search: queryParams.toString(),
    });
  };
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    // here's the new implementation to persist state after refresh/hot update
    // console.log("Query params:",queryParams.toString());
    const postAPI = process.env.REACT_APP_API_BASE_URL + '/api/post';
    const url = `${postAPI}?${queryParams.toString()}`;
    const handleFetchPosts = async () => {
      setLoading(true);
      await fetchPosts(url); // set everything!!!
      queryParams.delete('page');
      await fetchPostCnt(queryParams.toString());
      setLoading(false);
    };
    handleFetchPosts();
  }, [location]);
  useEffect(() => {
    // console.log("Post tags:",postTags)
    const tagsByCat = sortTags(postTags);
    // console.log("Tags by cat...?",tagsByCat);
    setTags(tagsByCat);
  }, [postTags]); // set sidebar tags on post changes
  if (loading || !tags) {
    return <SpinnerPage />;
  }

  return (
    <div className="w-100 p-2 mx-auto h-100">
      <Split
        main={
          <>
            <Row>
              <PostGrid posts={posts} />
            </Row>
            <Row className=" ">
              <PostPagination />
            </Row>
          </>
        }
        side={
          <div className="d-flex flex-column d-grid gap-2 ">
            <PostFilter />
            <Tags.TagifyInput handleSubmit={queryPosts} />
            {Object.keys(tags).map((key) => {
              return <Tags.TagList key={key} tags={tags[key]} />;
            })}
          </div>
        }
      />
    </div>
  );
};
