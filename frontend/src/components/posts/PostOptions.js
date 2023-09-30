import React from 'react';
import { Accordion, ListGroup } from 'react-bootstrap';

import api from '../../api';
import * as Context from '../../context';
import { ENDPOINTS } from 'endpoints';
export const PostOptions = ({ post }) => {
  const { currentUser, loading, setLoading } = Context.useGlobalContext();
  const { editing, setEditing } = Context.useSinglePostContext();
  const setAvatar = async () => {
    const userinfoAPI =  ENDPOINTS.USERINFO();
    const url = ENDPOINTS.USERINFO(`${currentUser.id}/`);
    const data = new FormData();
    const response = await api.get(post.thumb, { responseType: 'blob' });

    const fname = post.thumb.split('/').pop(); // post.thumb.substring(post.thumb.lastIndexOf('/')+1);
    const iconFile = new File([response.data], fname);
    console.log(response.data);
    console.log('fname:', fname);
    data.append('icon', iconFile);
    // data.append("user",currentUser.user)
    // data.set("icon",post.thumb)
    await api.patch(url, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log('Avatar set to', post.thumb);
  };
  const setBg = async () => {
    // const userinfoAPI = '/api/userinfo/';
    const url = ENDPOINTS.USERINFO(`${currentUser.id}/`) //`${userinfoAPI + currentUser.id}/`;
    const data = new FormData();
    const response = await api.get(post.image, { responseType: 'blob' });
    const fname = post.thumb.split('/').pop(); // post.thumb.substring(post.thumb.lastIndexOf('/')+1);
    const bgFile = new File([response.data], fname);
    console.log(response.data);
    console.log('fname:', fname);
    data.append('profile_bg', bgFile);
    // data.append("user",currentUser.user)
    // data.set("icon",post.thumb)
    await api.patch(url, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log('Bg set to', post.image);
  };
  return (
    <Accordion defaultActiveKey="0">
      <Accordion.Item eventKey="0">
        <Accordion.Header>Options</Accordion.Header>
        <Accordion.Body>
          <ListGroup variant="flush">
            {currentUser && (
              <>
                <ListGroup.Item action onClick={setAvatar}>
                  Set as avatar
                </ListGroup.Item>
                <ListGroup.Item action onClick={setBg}>
                  Set as profile background
                </ListGroup.Item>
                <ListGroup.Item action onClick={() => setEditing(!editing)}>
                  Edit post
                </ListGroup.Item>
              </>
            )}
          </ListGroup>
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );
};
