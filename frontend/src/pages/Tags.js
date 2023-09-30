import React, { useEffect } from 'react';

import api from '../api';
import { CommentForm, CommentItem } from '../components/comments';
import * as Context from '../context';
import * as Tags from "../components/tags"
import { Container } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { SpinnerPage } from '../components/utils';
export const TagsPage = () => {
  const { loading, setLoading } = Context.useGlobalContext();
  const location = useLocation(),
    navigate = useNavigate();
  const { tagifyTags, tags, setTags, flattenTags, searchTags, fetchTags } = Context.useTagContext();
  useEffect(() => {
    setTags([]);
    const queryParams = new URLSearchParams(location.search);
    const tagAPI =process.env.REACT_APP_API_BASE_URL + '/api/tag';
    const url = tagAPI + '?' + queryParams.toString();

    const handleFetchTags = async () => {
      setLoading(true);
      console.log('Fetching tags from url:', url);
      const tags = await fetchTags(url);
      console.log('Fetched tags:', tags);
      await setTags(tags);
      setLoading(false);
    };
    handleFetchTags();
  }, [location]);

  if (loading) return <SpinnerPage />;
  return (
    <div className="w-100 p-2 mx-auto h-100">
      <Container className="d-flex flex-column gap-2 my-2">
        <Tags.TagifyInput />
        <Tags.TagFilter />
      </Container>
      <Container>
        <Tags.TagTable tags={tags} />
      </Container>
    </div>
  );
};
