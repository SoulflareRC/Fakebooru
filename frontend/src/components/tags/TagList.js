import React from 'react';

import { TagItem } from './TagItem';

export const TagList = ({ tags }) => {
  console.log('tags:', tags);
  return (
    <div className="rounded d-flex flex-row flex-wrap gap-2">
      {tags.map((tag) => (
        <TagItem key={tag.id} tag={tag} />
      ))}
    </div>
  );
};
