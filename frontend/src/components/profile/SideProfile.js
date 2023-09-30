import React from 'react';

import { useGlobalContext } from '../../context';
import { LoginPrompt } from '../accounts';

export const SideProfile = () => {
  const { currentUser } = useGlobalContext();
  //    console.log("Context:"+context);
  console.log(currentUser);
  if (!currentUser) {
    return <LoginPrompt />;
  }
  return (
    <div
      className="d-flex flex-column border rounded overflow-hidden position-relative"
      id="profile"
    >
      <div
        className="flex-fill"
        id="profile-main"
        style={{
          height: '20vh',
        }}
      >
        <div
          id="bg"
          style={{
            backgroundImage: `url(${currentUser.profile_bg})`,
          }}
        >
          <a
            className="icon-wrap border"
            href={`/profile/${currentUser.id}`}
            style={{
              transform: 'translateY(75%)',
            }}
          >
            <img alt="No Icon" id="icon" src={currentUser.icon} />
          </a>
        </div>
        <div id="info">
          <a className="text-break text-decoration-none" href={`/profile/${currentUser.id}`}>
            {currentUser.display_name}
          </a>
        </div>
        <div className="text-primary">
          <span className="text-dark">{currentUser.slogan}</span>
        </div>
      </div>
      <div
        className=" w-100 text-break btn-group d-flex flex-row bottom-0 position-relative"
        id="operate"
      >
        <a className="btn btn-primary flex-fill" href="">
          Messages
        </a>
        <a className="btn btn-warning flex-fill" href="">
          Make a post
        </a>
        <a className="btn btn-success flex-fill" href="/accounts/logout">
          Sign out
        </a>
      </div>
    </div>
  );
};
