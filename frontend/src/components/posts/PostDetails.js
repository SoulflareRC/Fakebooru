import moment from 'moment/moment';
import React, { useState, useEffect } from 'react';
import { Card, ListGroup, Row, Col } from 'react-bootstrap';

// import { NameCard } from '../profile';
import * as Tags from '../tags';

import { PostActionBar } from './PostActionBar';
import { PostScore } from './PostScore';

export const PostDetails = ({ post }) => {
  const { uploader_info } = post;
  // const { icon } = uploader_info;
  // const name = uploader_info.display_name;
  // const { slogan } = uploader_info;
  // const score_avg = parseFloat(post.score_avg);
  // const score_rounded = score_avg.toFixed(0);
  const date = moment(post.publish_date);
  const timeAgo = date.fromNow();
  return (
    <ListGroup variant="flush">
      <ListGroup.Item>
        <Card className="border-0">
          <Card.Header className="bg-white">Uploaded by:</Card.Header>
          <NameCard {...uploader_info} />
          <Card.Footer className="bg-white text-sm-end">
            <small> {timeAgo.toString()}</small>
          </Card.Footer>
        </Card>
      </ListGroup.Item>
      <ListGroup.Item>
        <Card className="border-0">
          <Card.Body className="bg-white">
            Rating: <Tags.RatingBadge rating={post.rating} />
          </Card.Body>
        </Card>
      </ListGroup.Item>
      <ListGroup.Item>
        <Card className="border-0">
          <Card.Body className="bg-white">
            <p>
              Score:
              <PostScore post={post} />
            </p>
          </Card.Body>
        </Card>
      </ListGroup.Item>
      <ListGroup.Item>
        <Card className="border-0">
          <Card.Body className="bg-white">
            <PostActionBar post={post} showText />
          </Card.Body>
        </Card>
      </ListGroup.Item>
      <ListGroup.Item>
        <Card className="border-0">
          <Card.Header className="bg-white">
            <p>Favorited by: </p>
          </Card.Header>
          <Card.Footer style={{ height: '5vh' }}>
            <Row className="gap-1">
              {post.saved_by.map((userinfo) => {
                return (
                  <Col key={userinfo.id}>
                    <a href={`/profile/${userinfo.id}`}>{userinfo.display_name} </a>
                  </Col>
                );
              })}
            </Row>
          </Card.Footer>
        </Card>
      </ListGroup.Item>
      <ListGroup.Item>
        <Card className="border-0">
          <Card.Header className="bg-white">
            <p>Source: </p>
          </Card.Header>
          <Card.Footer>
            <a href={post.source}>{post.source}</a>
          </Card.Footer>
        </Card>
      </ListGroup.Item>
      <ListGroup.Item>
        <Card className="border-0">
          <Card.Header className="bg-white">
            <p>Hash: </p>
          </Card.Header>
          <Card.Footer>
            <p>{post.hash}</p>
          </Card.Footer>
        </Card>
      </ListGroup.Item>
    </ListGroup>
  );
};
// import React from 'react';
// import { Card, Col, Row } from 'react-bootstrap';

const NameCard = ({ icon, display_name, slogan, id }) => {
  return (
    <Card className="d-flex align-items-center border">
      <Card.Body className="d-flex align-items-center">
        <Row>
          <Col className="d-flex align-items-center justify-content-center" xs={3}>
            <a className="icon-wrap" href={`/profile/${id}`}>
              <img alt="No Icon" className="object-fit-cover h-100 w-100  " src={icon} />
            </a>
          </Col>
          <Col className="d-flex align-items-center justify-content-center" xs={9}>
            <div className="">
              <h5 className="mb-0">{display_name}</h5>
              <p className="text-muted mb-0">
                <small>{slogan}</small>
              </p>
            </div>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};
