import React from 'react';
import { Row, Col } from 'react-bootstrap';

import { SinglePost } from './SinglePost';

export const PostListRow = ({ posts }) => {
  return (
    <Row className="overflow-hidden">
      <div className="d-flex flex-nowrap overflow-x-scroll m-2">
        {posts.map((post) => {
          return (
            <Col key={post.id} xs="auto">
              <SinglePost post={post} />
            </Col>
          );
        })}
      </div>
    </Row>
  );
};
