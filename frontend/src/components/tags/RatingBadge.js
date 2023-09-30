import React from 'react';
import { Badge } from 'react-bootstrap';

import { POST_RATINGS } from '../../constants';

export const RatingBadge = ({ rating }) => {
  const color = POST_RATINGS.toColor(rating);
  return <Badge bg={color}>{rating}</Badge>;
};
