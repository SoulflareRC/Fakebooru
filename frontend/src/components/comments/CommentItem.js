import moment from 'moment';
import React, { useState } from 'react';
import * as BS from 'react-bootstrap';

// import * as BSIcon from 'react-bootstrap-icons';
// import { useNavigate, useLocation } from 'react-router-dom';
import { useCommentContext, useGlobalContext } from '../../context';

import { CommentVote } from './CommentVote';

export const CommentItem = (props) => {
  // const [comment, setComment] = useState(props.comment);
  const {comment} = props; 

  // const {fetchPost} = useSinglePostContext();
  const { setReplying, setCommenting, delComment } = useCommentContext();

  const { currentUser } = useGlobalContext();
  const [showDelModal, setShowDelModal] = useState(false);
  const handleDelComment = async () => {
    // console.log("Comments when handleDelComment is triggered:",comments)
    console.log('Deleting comment with id:', comment.id);
    delComment(comment.id);
    setShowDelModal(false);
  };
  if (!comment) return null;
  const date = moment(comment.submit_date).utc();
  const timeAgo = date.fromNow();
  return (
    <>
      <div className="d-flex flex-column gap-2" {...props}>
        <div className="d-flex gap-2 align-items-center">
          <a
            className="d-flex gap-2  text-decoration-none border-0 px-0"
            href={`/profile/${comment.user_userinfo.id}`}
          >
            <div className="d-flex justify-content-center align-items center d-flex">
              <a
                className="icon-wrap outline outline-white border border-primary"
                style={{
                  maxHeight: '5vh',
                }}
              >
                <img alt="No Icon" src={comment.user_userinfo.icon} />
              </a>
            </div>
            <div className="d-flex align-items-center">{comment.user_userinfo.display_name}</div>
          </a>
          <div className="h-100 flex-fill text-secondary d-flex align-items-center">
            <small>{timeAgo}</small>
          </div>
        </div>
        <div className="d-flex gap-2">
          <span className="mx-2">{comment.comment}</span>
        </div>
        <div className="d-flex">
          <CommentVote comment={comment} />
          <a
            className="mx-2 text-decoration-none"
            href="#comment-form"
            onClick={() => {
              setReplying(comment);
              const commentingComment = comment.parent_top ? comment.parent_top : comment;
              setCommenting(commentingComment.id);
              console.log('Set commenting comment to:', commentingComment);
            }}
          >
            Reply
          </a>
          {currentUser && comment.user === currentUser.user && (
            <a
              className="mx-2 text-decoration-none text-danger"
              href="javascript:void(0)"
              onClick={() => setShowDelModal(true)}
            >
              Delete
            </a>
          )}
        </div>
        {comment.children.length > 0 && (
          <div className="d-flex gap-2 p-1">
            <div className="vr" />
            <div className="d-flex flex-fill flex-column gap-2 bg-secondary-subtle p-2">
              {comment.children.map((child) => {
                return <CommentItem key={child.id} comment={child} />;
              })}
            </div>
          </div>
        )}
      </div>

      <BS.Modal centered show={showDelModal} size="lg" onHide={() => setShowDelModal(false)}>
        <BS.Modal.Header closeButton>
          <BS.Modal.Title className="text-danger fw-bold ">WARNING</BS.Modal.Title>
        </BS.Modal.Header>
        <BS.Modal.Body>
          <p>Are you sure you want to delete this comment?</p>
        </BS.Modal.Body>
        <BS.Modal.Footer>
          <BS.Button variant="danger" onClick={handleDelComment}>
            Delete
          </BS.Button>
        </BS.Modal.Footer>
      </BS.Modal>
    </>
  );
};
