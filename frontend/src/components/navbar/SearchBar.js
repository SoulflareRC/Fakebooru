import React from 'react';
import { Button, Form, InputGroup } from 'react-bootstrap';
import { Search } from 'react-bootstrap-icons';

export const SearchBar = () => {
  return (
    <Form className="form-inline text-white flex-fill">
      <InputGroup>
        <Form.Control name="search" placeholder="search" type="search" />
        <Button type="submit">
          <Search />
        </Button>
      </InputGroup>
    </Form>
  );
};
