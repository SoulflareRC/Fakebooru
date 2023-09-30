import React from 'react';
import { Table } from 'react-bootstrap';

import { TagBadge } from './TagBadge';

export const TagTable = ({ tags }) => {
  // on tags page

  return (
    <Table bordered hover striped>
      <thead>
        <tr>
          <th>Posts</th>
          <th>Name</th>
          <th>Type</th>
        </tr>
      </thead>
      <tbody>
        {tags.map((tag) => {
          return (
            <tr key={tag.id}>
              <td>{tag.post_cnt}</td>
              <td>
                {' '}
                <TagBadge tag={tag} />{' '}
              </td>
              <td>{tag.category}</td>
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
};
