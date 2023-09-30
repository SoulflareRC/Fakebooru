import React from 'react';
import { Badge } from 'react-bootstrap';
import { TAG_TYPES } from '../../constants';

export const TagBadge = ({ tag, show_cnt = false, link = true, right, left }) => {
  const color = TAG_TYPES.toColor(tag.category);
  return (
    <Badge bg={color}>
      {left}
      <a className="text-white text-decoration-none fw-normal" href={link ? `/tag/${tag.id}` : ''}>
        {tag.name}
      </a>
      {show_cnt && <Badge bg="secondary">{tag.post_cnt}</Badge>}
      {right}
    </Badge>
  );
};
