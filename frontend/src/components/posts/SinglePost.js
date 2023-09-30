import React from 'react';
import { Tooltip, Card, Overlay, OverlayTrigger } from 'react-bootstrap';

import * as Context from '../../context';

import { PostActionBar } from './PostActionBar';
import { SinglePostInfo } from './SinglePostInfo';

export const SinglePost = ({ post }) => {
  const renderInfo = (props) => {
    return (
      <Tooltip className="bg-transparent bg-primary text-white" {...props}>
        <SinglePostInfo post={post} />
      </Tooltip>
    );
  };

  return (
    // <div className="col border border-primary" >
    <Card className="position-relative border-0 border-none col d-flex overflow-hidden">
      <Card.Body
        className="d-flex justify-content-center  p-1"
        style={{
          height: '10vh',
        }}
      >
        <OverlayTrigger overlay={renderInfo} placement="right">
          <a href={`/post/${post.id}`}>
            <img
              alt="No image"
              className="object-fit-contain h-100 w-100   m-0 p-0 "
              src={post.thumb}
            />
          </a>
        </OverlayTrigger>
      </Card.Body>
      <Card.Footer className="bg-white">
        <PostActionBar post={post} />
      </Card.Footer>
    </Card>
    // </div>
  );
};
