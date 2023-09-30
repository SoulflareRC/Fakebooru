import React from 'react';
import { Accordion, InputGroup, Form, Button, FormControl } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';

export const PostFilter = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault(); // don't submit yet
    const form = e.target;
    const data = new FormData(form);
    const time = data.get('time');
    if (time !== 'none') {
      const time_query = `last_${time}`;
      data.append(time_query, data.get('time_n'));
    }
    data.delete('time');
    data.delete('time_n');
    for (const pair of data.entries()) {
      console.log(`${pair[0]}, ${pair[1]}`);
    }
    console.log('filter submitted');
    const queryParams = new URLSearchParams(data);
    navigate({
      pathname: location.pathname,
      search: queryParams.toString(),
    });
  };
  return (
    <Accordion>
      <Accordion.Item>
        <Accordion.Header>Filter settings</Accordion.Header>
        <Accordion.Body>
          <Form className="d-flex flex-column gap-2" onSubmit={handleSubmit}>
            <InputGroup>
              <InputGroup.Text>ordering</InputGroup.Text>
              <Form.Select name="ordering">
                <option value="-publish_date">Date</option>
                <option value="-score_avg">Quality</option>
                <option value="-saved_by_cnt">Popularity</option>
              </Form.Select>
            </InputGroup>
            <InputGroup>
              <InputGroup.Text>Last</InputGroup.Text>
              <FormControl defaultValue={1} min="1" name="time_n" type="number" />
              <Form.Select name="time">
                <option value="none">(none)</option>
                <option value="day">days</option>
                <option value="week">weeks</option>
                <option value="month">months</option>
              </Form.Select>
            </InputGroup>
            <Button className="w-100" type="submit" variant="outline-secondary">
              Search
            </Button>
          </Form>
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );
};
