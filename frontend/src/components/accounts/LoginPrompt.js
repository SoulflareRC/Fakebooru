import React from 'react';
import { Card, ButtonGroup } from 'react-bootstrap';
import { NodePlusFill, KeyFill } from 'react-bootstrap-icons';

export const LoginPrompt = () => {
  return (
    <Card>
      <Card.Header className="text-bg-dark">You are not logged in.</Card.Header>
      <Card.Footer>
        <ButtonGroup className="d-flex">
          <a className="btn btn-outline-primary flex-fill" href="/accounts/login">
            <KeyFill /> Login
          </a>
          <a className="btn btn-outline-primary flex-fill" href="/accounts/signup">
            <NodePlusFill /> Sign up
          </a>
        </ButtonGroup>
      </Card.Footer>
    </Card>
  );
};
