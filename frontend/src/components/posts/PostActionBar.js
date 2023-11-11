import React, { useState } from 'react';
import { Diamond, Star, StarFill, Download } from 'react-bootstrap-icons';

import api from '../../api';
import * as Context from '../../context';
import { ENDPOINTS } from 'endpoints';
export const PostActionBar = ({ post, showText = false }) => {
  const { currentUser } = Context.useGlobalContext();
  const saved_by_users = post.saved_by.map((userinfo) => userinfo.user);
  // console.log("Saved by users:",saved_by_users)
  const [saved, setSaved] = useState(currentUser && saved_by_users.includes(currentUser.user));
  // console.log("Post "+post.id+" is saved by user "+currentUser.user+"?"+saved)
  const toggleSave = async () => {
    const savePostAPI = ENDPOINTS.POST(`${post.id}/save`);
    await api.get(savePostAPI);
    setSaved(!saved);
  };
  return (
    <div className=" text-center gap-2 d-flex flex-row justify-content-center ">
      <a
        className="icon-link icon-link-hover"
        href={post.image}
        rel="noreferrer"
        target="_blank"
        title="original"
      >
        <Diamond />
        {showText && <span>Original</span>}{' '}
      </a>
      {currentUser && (
        <a className="icon-link icon-link-hover" href="#" title="save" onClick={toggleSave}>
          {saved ? <StarFill /> : <Star />}
          {showText && <span>{saved ? 'Saved' : 'Save'}</span>}
        </a>
      )}
      <a className="icon-link icon-link-hover" download="image.jpg" href={post.preview} title="download">
        <Download />
        {showText && <span>Download</span>}
      </a>
    </div>
  );
};
