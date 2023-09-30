import React, { useState, useEffect } from 'react';
import { Button, Form, Row } from 'react-bootstrap';
// import { useLocation, useNavigate } from 'react-router-dom';

import api from '../../api';
import * as Context from '../../context';
import * as Tags from '../tags';
import { ENDPOINTS } from 'endpoints';
export const PostEditForm = ({ post }) => {
  //   const navigate = useNavigate();
  //   const location = useLocation();
  const ratings = ['general', 'sensitive', 'questionable', 'explicit', 'unrated'];
  const { tags, tagifyTags, setTagifyTags } = Context.useTagContext();
  const { setPost, setEditing, fetchPost } = Context.useSinglePostContext();
  const handleSubmit = async (e) => {
    const postUpdateAPI = ENDPOINTS.POST(`${post.id}/`);
    e.preventDefault();
    const data = new FormData(e.target);
    // data.set('tags', tagifyTags.join(','));
    let tags = tagifyTags.join(','); 
    tags = tags.split(','); 
    data.delete('tags'); 
    tags.forEach(tag => {
      data.append('tags',tag);
    });
    const response = await api.patch(postUpdateAPI, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    fetchPost(post.id);
    setEditing(false);
  };
  // console.log("Emm WTF")
  useEffect(() => {
    console.log('Post!!!', post);
    if (post) {
      console.log('tags:', post.tags);
      const tags_list = post.tags.map((tag) => tag.name);
      console.log('Tags list:', tags_list);
      setTagifyTags(tags_list);
    }
  }, [post]);
  return (
    <form
      action=""
      className="d-flex flex-column gap-2"
      encType="multipart/form-data"
      id="post-form"
      method="post"
      onSubmit={handleSubmit}
    >
      <Tags.TagifyInput placeholder="Add tags" />
      {/* <PostRating/> */}
      <Form.Label>Rating</Form.Label>
      <Row>
        {ratings.map((item) => {
          return (
            <Form.Group key={item}>
              <Form.Label className="mx-1" for={`rating-${item}`}>
                <Tags.RatingBadge rating={item} />
              </Form.Label>
              <Form.Check
                key={item}
                defaultChecked={item === post.rating}
                id={`rating-${item}`}
                inline
                name="rating"
                type="radio"
                value={item}
              />
            </Form.Group>
          );
        })}
      </Row>
      <Form.Label htmlFor="source">Source (optional)</Form.Label>
      <Form.Control id="source" name="source" placeholder="Link to the source" type="url" />
      <Button type="submit"> Submit </Button>
    </form>
  );
};
