import React from 'react';
import { Pagination, ListGroup, Badge } from 'react-bootstrap';

export const SinglePostInfo = ({ post }) => {
  // console.log(post)
  const formatSize = (size) => {
    if (size < 1024) return `${size} b`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(2)} kb`;
    return `${(size / 1024 / 1024).toFixed(2)} mb`;
  };
  const formattedFileSize = formatSize(post.image_size);
  return (
    <ListGroup className="text-white" variant="flush">
      <ListGroup.Item className="bg-transparent text-light">
        Post id: <Badge>{post.id}</Badge>
      </ListGroup.Item>
      <ListGroup.Item className="bg-transparent text-light">
        Image size:{' '}
        <Badge>
          {post.image_width} x {post.image_height} px
        </Badge>
      </ListGroup.Item>
      <ListGroup.Item className="bg-transparent text-light">
        File size: <Badge>{formattedFileSize}</Badge>
      </ListGroup.Item>
      {post.score_avg && (
        <ListGroup.Item className="bg-transparent text-light">
          Score: <Badge>{post.score_avg}</Badge>
        </ListGroup.Item>
      )}
      <ListGroup.Item className="bg-transparent text-light">
        Saved: <Badge>{post.saved_by_cnt}</Badge>
      </ListGroup.Item>
    </ListGroup>
  );
};
