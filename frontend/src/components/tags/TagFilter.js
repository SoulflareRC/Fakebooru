import React from 'react';
import { InputGroup, Form, Button } from 'react-bootstrap';

import { TAG_TYPES } from '../../constants';

export const TagFilter = () => {
  // on tags page
  return (
    <Form className="d-flex flex-column gap-2">
      <InputGroup>
        <InputGroup.Text>Ordering</InputGroup.Text>
        <Form.Select name="ordering">
          <option value="-date">Date</option>
          <option value="-post_cnt">Post Count</option>
          <option value="-name">Name</option>
        </Form.Select>
      </InputGroup>
      <InputGroup>
        <InputGroup.Text>Type</InputGroup.Text>
        <Form.Select name="category">
          <option value="">All</option>
          {Object.keys(TAG_TYPES)
            .filter((key) => typeof TAG_TYPES[key] === 'string')
            .map((type) => {
              const typeStr = TAG_TYPES[type];
              return (
                <option key={typeStr} value={typeStr}>
                  {typeStr}
                </option>
              );
            })}
        </Form.Select>
      </InputGroup>
      <Button className="w-100" type="submit" variant="outline-secondary">
        Search
      </Button>
    </Form>
  );
};
