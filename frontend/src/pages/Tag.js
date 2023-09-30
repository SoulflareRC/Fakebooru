import MDEditor from '@uiw/react-md-editor';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { InputGroup, Form } from 'react-bootstrap';
import { PencilSquare } from 'react-bootstrap-icons';
import ReactMarkdown from 'react-markdown';
import { useParams } from 'react-router-dom';

import api from '../api';
import { CommentForm, CommentItem } from '../components/comments';
import { PostListRow } from '../components/posts';
import * as Tags from '../components/tags';
import { SpinnerPage } from '../components/utils';
import { TAG_TYPES } from '../constants';
import * as Context from '../context';
import { ENDPOINTS } from 'endpoints';
export const TagPage = () => {
  // TODO: Edit related tags
  const { id } = useParams();
  const { loading, setLoading } = Context.useGlobalContext();
  const { tag, setTag, fetchTag, edit, setEdit } = Context.useSingleTagContext();
  const [mdTxt, setMdTxt] = useState(tag.description);
  const handleTag = async () => {
    setLoading(true);
    await fetchTag(id);
    setLoading(false);
  };
  useEffect(() => {
    handleTag();
  }, []);
  useEffect(() => {
    setMdTxt(tag.description);
  }, [tag.description]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    data.set('description', mdTxt);
    console.log('Markdown text:', mdTxt);
    console.log('Category:', data.get('category'));
    const tagAPI =ENDPOINTS.TAG(`${tag.id}/`);
    const response = await api.patch(tagAPI, data);
    setTag({ ...tag, category: data.get('category') });
    setEdit(false);
  };
  if (loading || !tag) return <SpinnerPage />;
  const color = TAG_TYPES.toColor(tag.category);
  return (
    <div className="w-100 p-2 mx-auto h-100">
      <h3 className="position-relative">
        <span className={`text-${color}`}>{tag.category}:</span> <Tags.TagBadge tag={tag} />
        <a
          className="text-primary text-decoration-none position-absolute end-0"
          href="#"
          onClick={() => setEdit(!edit)}
        >
          <PencilSquare />
        </a>
      </h3>
      <hr />
      <Form className="d-flex flex-column gap-2 p-2" onSubmit={handleSubmit}>
        {edit ? (
          <>
            <InputGroup>
              <InputGroup.Text>Type:</InputGroup.Text>
              <Form.Select defaultValue={tag.category} name="category">
                {Object.keys(TAG_TYPES)
                  .filter((key) => typeof TAG_TYPES[key] === 'string')
                  .map((type) => {
                    const typeStr = TAG_TYPES[type];
                    return (
                      <option key={typeStr} value={typeStr}>
                        {typeStr}
                      </option>
                    );
                  })}
              </Form.Select>
            </InputGroup>
            <MDEditor value={mdTxt} onChange={setMdTxt} />

            <div className="border rounded w-100 btn-group">
              <div className="btn btn-outline-secondary" onClick={() => setEdit(false)}>
                Cancel
              </div>
              <button className="btn btn-outline-primary" type="submit">
                Save
              </button>
            </div>
          </>
        ) : (
          <MDEditor.Markdown source={mdTxt} style={{ whiteSpace: 'pre-wrap' }} />
        )}
      </Form>
      <br />
      <h4>Related tags:</h4>
      <hr />
      <p>
        {tag.related && tag.related.length ? (
          <div className="d-flex gap-2">
            {tag.related.map((related_tag) => (
              <Tags.TagBadge tag={related_tag} />
            ))}
          </div>
        ) : (
          <>No related tag</>
        )}
      </p>

      <h4>Tagged posts</h4>
      <hr />
      {tag.tagged_posts && <PostListRow posts={tag.tagged_posts} />}
    </div>
  );
};
