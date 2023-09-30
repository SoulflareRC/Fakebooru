import React from 'react';
import { Col, Row, Container } from 'react-bootstrap';
import { StarFill, Star } from 'react-bootstrap-icons';

import api from '../../api';
import * as Context from '../../context';
import { ENDPOINTS } from 'endpoints';
export const PostScore = ({ post }) => {
  const { fetchPost } = Context.useSinglePostContext();
  const score_avg = parseFloat(post.score_avg);
  const score_rounded = score_avg.toFixed(0);
  const { rated_by } = post;
  const { currentUser } = Context.useGlobalContext();
  const rated = currentUser !== null && rated_by.includes(currentUser.user);
  const ratePost = async (score) => {
    const ratePostAPI =ENDPOINTS.RATING();
    const data = new FormData();
    data.append('post', post.id);
    data.append('by', currentUser.user);
    data.append('score', score);
    const response = await api.post(ratePostAPI, data);
    fetchPost(post.id); // force update things
  };
  // console.log(rated_by,currentUser);
  const stars = [];
  for (let i = 0; i < 5; i++) {
    if (i < score_rounded)
      stars.push(
        <Col key={i}>
          <a href="#" onClick={() => ratePost(i + 1)}>
            <StarFill />
          </a>
        </Col>
      );
    else
      stars.push(
        <Col key={i}>
          <a
            href="#"
            onClick={() => {
              ratePost(i + 1);
            }}
          >
            <Star />
          </a>
        </Col>
      );
  }

  return (
    <Container className="text-center text-primary w-100 d-flex flex-column justify-content-center">
      <Row className="mx-3 d-flex flex-row">{stars}</Row>
      <Row className="">
        <small>
          {score_avg} ({rated_by.length} ratings)
        </small>
      </Row>
      {rated && (
        <Row className="">
          <small>(You rated)</small>
        </Row>
      )}
    </Container>
  );
};
