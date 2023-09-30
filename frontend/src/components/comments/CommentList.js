import React from 'react';

import { CommentItem } from './CommentItem';
import { useCommentContext } from 'context';
export const CommentList = (props) => {
  const {comments} = useCommentContext();
  return (
    <>
      {comments.map((comment) => {
        return (
          <div key={comment.id}>
            <CommentItem comment={comment} />
            <hr />
          </div>
        );
      })}
    </>
  );
};
