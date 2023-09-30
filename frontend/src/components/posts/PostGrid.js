import React from 'react';

import { SinglePost } from './SinglePost';

export const PostGrid = ({ posts }) => {
  return (
    <div className="h-100 row row-cols-1 row-cols-xs-1  rol-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-6  gap-2 mx-2">
      {posts.map((post) => {
        return <SinglePost key={post.id} post={post} />;
      })}
    </div>
  );
};
