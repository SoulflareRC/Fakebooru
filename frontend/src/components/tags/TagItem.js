import React from 'react';
import { Badge } from 'react-bootstrap';
import { PlusLg } from 'react-bootstrap-icons';

import { TAG_TYPES } from '../../constants';
import { useTagContext } from '../../context';
import { TagBadge } from './TagBadge';
export const TagItem = ({ tag }) => {
  const { tagifyTags, setTagifyTags } = useTagContext();
  const color = TAG_TYPES.toColor(tag.category);

  return (
    <TagBadge tag={tag}
    left = {
      <a
        className="text-white btn p-1"
        onClick={() => {
          if (!tagifyTags.includes(tag.name)) {
            setTagifyTags([...tagifyTags, tag.name]);
          }
        }}
      >
        <PlusLg />
      </a>
    }
    right= {
      <Badge bg="secondary">{tag.post_cnt}</Badge>
    }
    />
    // <Badge bg={color}>
    //   <a
    //     className="text-white btn p-1"
    //     onClick={() => {
    //       if (!tagifyTags.includes(tag.name)) {
    //         setTagifyTags([...tagifyTags, tag.name]);
    //       }
    //     }}
    //   >
    //     <PlusLg />
    //   </a>{' '}
    //   <a>{tag.name}</a> <Badge bg="secondary">{tag.post_cnt}</Badge>
    // </Badge>
  );
};
