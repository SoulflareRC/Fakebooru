import React from 'react';
import { Row, Col } from 'react-bootstrap';

export const Split = ({ side, main }) => {
  return (
    <Row>
      <Col xs={3}>{side}</Col>
      <Col xs={9}>{main}</Col>
    </Row>
  );
};
