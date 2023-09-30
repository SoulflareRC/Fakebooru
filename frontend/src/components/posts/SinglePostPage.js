import React, { useEffect } from 'react';
import { Pagination } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';

import * as Context from '../../context';
import * as Comments from '../comments';

import { PostEditForm } from './PostEditForm';

export const SinglePostPage = (props) => {
  const { editing, post, fetchPost } = Context.useSinglePostContext();
  const { comments, setComments } = Context.useCommentContext();
  useEffect(() => {
    console.log("Post comments updated!"); 
    setComments(post.comments);
  }, [post, setComments]);
  useEffect(() => {
    console.log('Comments:', comments);
  }, [comments]);
  return (
    <div className="w-100  d-flex flex-column gap-2 justify-content-center z-3">
      <img alt="No image" className="img-fluid" src={post.preview} />
      {editing && <PostEditForm post={post} />}
      <Comments.CommentForm
        post={post}
        submitExtraActions={() => {
          fetchPost(post.id);
          console.log('Fetched post of id:', post.id);
        }}
      />
      <Comments.CommentList comments={comments} />
    </div>
  );
};
