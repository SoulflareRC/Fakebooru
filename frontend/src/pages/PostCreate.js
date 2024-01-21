import React, { useState } from 'react';
import { Form, InputGroup, Button } from 'react-bootstrap';
import { FilePond } from 'react-filepond';
import { useNavigate } from 'react-router-dom';

import api from '../api';
import * as Tags from '../components/tags';
import { SpinnerPage } from '../components/utils';
import * as Context from '../context';
import { ENDPOINTS } from 'endpoints';
export const PostCreate = () => {
  const navigate = useNavigate();
  const { currentUser, loading, setLoading } = Context.useGlobalContext();
  const ratings = ['general', 'sensitive', 'questionable', 'explicit', 'unrated'];
  const [files, setFiles] = useState([]);
  const { tagifyTags, setTagifyTags } = Context.useTagContext();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // setLoading(true); 
    const data = new FormData(e.target);
    // tagifyTags.forEach(tag => {
    //   data.append('tags',tag); 
    // });
    // data.set('tags', tagifyTags.join(','));
    let tags = tagifyTags.join(','); 
    // console.log('tags type:',typeof(tags)); 
    tags = tags.split(','); 
    // console.log("Tags:",tags);
    data.delete('tags'); 
    tags.forEach(tag => {
      data.append('tags',tag);
    });
    console.log(data.get('tags'))
    const postCreateAPI = ENDPOINTS.POST(); 
    const response = await api.post(postCreateAPI, data);
    console.log(response); 
    const post = response.data; 
    const resURL = "/post/"+post.id; 
    // setLoading(false);
    // const { responseURL } = response.request;
    // console.log(response.request.responseURL);
    // navigate(responseURL);
    navigate(resURL);
  };
  const handleFileChange = async (fileItems) => {
    // const files = fileItems.map(item=>item.file)
    console.log('File updated', fileItems.length);
    setFiles(fileItems);
  };
  const suggestTags = async () => {
    if (files.length) {
      setLoading(true);
      console.log('Suggesting tags.');
      const tagSuggestAPI =process.env.REACT_APP_API_BASE_URL + '/api/tag/suggest/';
      const form = document.querySelector('#post-form');
      const data = new FormData(form);
      // console.log(data.get("image"))
      // return
      const response = await api.post(tagSuggestAPI, data);
      // console.log(response);
      const { tags } = response.data;
      console.log('Suggested:', tags);
      if (tags.length) {
        console.log('Updating tags', tags);
        setTagifyTags(tags);
      }
      setLoading(false);
    }
  };
  // image,rating,source,tags
  //   if (loading) return <SpinnerPage />;
  return (
    <div className="w-100 p-2 mx-auto h-100">
      <form
        action=""
        className="d-flex flex-column gap-2"
        encType="multipart/form-data"
        id="post-form"
        method="post"
        onSubmit={handleSubmit}
      >
        <FilePond
          files={files}
          name="image"
          onupdatefiles={handleFileChange}
          required
          storeAsFile
        />
        <InputGroup>
          <Tags.TagifyInput placeholder="Add tags" />
          <Button onClick={suggestTags}>Suggest</Button>
        </InputGroup>
        {/* <PostRating/> */}
        <Form.Label>Rating</Form.Label>
        {ratings.map((item) => {
          return (
            <Form.Group key={item}>
              <Form.Label className="mx-1" for={`rating-${item}`}>
                <Tags.RatingBadge rating={item} />
              </Form.Label>
              <Form.Check
                key={item}
                defaultChecked={item === 'unrated'}
                id={`rating-${item}`}
                inline
                name="rating"
                type="radio"
                value={item}
              />
            </Form.Group>
          );
        })}

        <Form.Label htmlFor="source">Source (optional)</Form.Label>
        <Form.Control id="source" name="source" placeholder="Link to the source" type="url" />
        <Button type="submit">
          Submit
        </Button>
      </form>
    </div>
  );
};
