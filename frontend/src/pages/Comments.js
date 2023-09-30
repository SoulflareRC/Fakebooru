import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import { CommentForm, CommentItem } from '../components/comments';
import { SinglePost } from '../components/posts';
import * as Tags from '../components/tags';
import * as Context from '../context';
import { ENDPOINTS } from 'endpoints';
export const CommentsPage = () => {
  // TODO: Reply comment form + Post Comment Form
  const { comments, setComments, fetchComments, commenting, setCommenting, replying, setReplying } =
    Context.useCommentContext();
  const { loading, setLoading } = Context.useGlobalContext();
  const loc = useLocation();
  useEffect(() => {
    setLoading(true);
    const queryParams = new URLSearchParams();
    const commentsAPI = ENDPOINTS.COMMENT();
    queryParams.set('ordering', '-submit_date');
    const url = `${commentsAPI}?${queryParams.toString()}`;
    fetchComments(url);
    setLoading(false);
  }, []);
  useEffect(() => {
    console.log('Comments updated!!!', comments);
  }, [comments]);
  return (
    <div className="w-100 p-2 mx-auto h-100">
      {comments.map((comment) => {
        // console.log(comment);
        return (
          <div key={comment.id}>
            <Row>
              <Col xs={2}>
                <SinglePost post={comment.post} />
              </Col>
              <Col xs={10}>
                <Row className="mb-2 gap-2">
                  <Row>
                    <Col>
                      <strong>Date: </strong>
                      <span>{moment(comment.post.publish_date).toString()}</span>
                    </Col>
                    <Col>
                      <strong>Uploader: </strong>
                      <span>{comment.post.uploader_info.display_name}</span>
                    </Col>
                    <Col>
                      <strong>Rating: </strong>
                      <Tags.RatingBadge rating={comment.post.rating} />
                    </Col>
                  </Row>
                  <div className="d-flex flex-wrap gap-2 flex-row">
                    <strong>Tags: </strong>
                    {comment.post.tags.map((tag) => {
                      return <Tags.TagBadge key={tag.id} tag={tag} />;
                    })}
                  </div>
                </Row>
                <Row>
                  <CommentItem comment={comment} />
                </Row>
                <Row>
                  <a
                    className="mx-2 text-decoration-none"
                    href="javascript:void(0)"
                    onClick={() => setCommenting(comment.id)}
                  >
                    Post Comment
                  </a>
                </Row>
                {commenting === comment.id && (
                  <Row>
                    <CommentForm post={comment.post} submitExtraActions={() => {
                        const queryParams = new URLSearchParams(loc.search);
                        const commentsAPI = ENDPOINTS.COMMENT();
                        queryParams.set('ordering', '-submit_date');
                        const url = `${commentsAPI}?${queryParams.toString()}`;
                        fetchComments(url); 
                      }} />
                  </Row>
                )}
              </Col>
            </Row>
            <hr />
          </div>
        );
      })}
    </div>
  );
};
