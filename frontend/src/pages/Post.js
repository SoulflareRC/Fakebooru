import React, { useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { CommentForm, CommentItem } from '../components/comments';
import { SinglePostPage, SinglePost, PostDetails, PostOptions } from '../components/posts';
import * as Tags from '../components/tags';
import { SpinnerPage, Split } from '../components/utils';
import * as Context from '../context';
import { useParams } from 'react-router-dom';

export const Post = () => {
  const { loading, setLoading } = Context.useGlobalContext();
  const { post, fetchPost } = Context.useSinglePostContext();
  const { tags, setTags, sortTags, queryWithTags } = Context.useTagContext();
  const { id } = useParams();
  useEffect(() => {
    const handleFetchPost = async () => {
      setLoading(true);
      await fetchPost(id);
      setLoading(false);
      console.log('Done fetching post');
    };
    console.log('Fetching post id:', id);
    handleFetchPost();
  }, []);
  useEffect(() => {
    console.log('Post updated:', post);
    if (post !== null) setTags(sortTags(post.tags));
  }, [post]);
  if (loading || !post || !tags) {
    return <SpinnerPage />;
  }

  return (
    <div className="w-100 p-2 mx-auto h-100">
      <Split
        side={
          <div className="d-flex flex-column d-grid gap-2 ">
            {/* <TagContext.Provider> */}
            <Context.TagProvider>
              <Tags.TagifyInput handleSubmit={queryWithTags} />
              {Object.keys(tags).map((key) => {
                return <Tags.TagList key={key} tags={tags[key]} />;
              })}
              {/* </TagContext.Provider> */}
            </Context.TagProvider>
            <PostDetails post={post} />
            <PostOptions post={post} />
          </div>
        }
        main={
          <Context.TagProvider>
            <SinglePostPage post={post} />
          </Context.TagProvider>
        }
      />
    </div>
  );
};
