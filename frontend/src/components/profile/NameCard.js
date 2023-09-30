import React from 'react';
import { Card, Col, Row } from 'react-bootstrap';

export const NameCard = ({ icon, display_name, slogan, id }) => {
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
