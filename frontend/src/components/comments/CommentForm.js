import React, { useState, useRef } from 'react';
import * as BS from 'react-bootstrap';
import * as BSIcon from 'react-bootstrap-icons';
// import { useNavigate, useLocation } from 'react-router-dom';
import { ENDPOINTS } from 'endpoints';
import api from '../../api';
import { useCommentContext, useGlobalContext } from '../../context';

export const CommentForm = ({ post, submitExtraActions=()=>{} }) => {
  const { currentUser } = useGlobalContext();
  // const {fetchPost} = useSinglePostContext();
  const { replying, setReplying } = useCommentContext();
  const commentRef = useRef(null);
  const [content, setContent] = useState('');
  const [wordCnt, setWordCnt] = useState(0);
  const maxWordCnt = 150;
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (wordCnt <= maxWordCnt) {
      const data = new FormData(e.target);
      data.set('object_pk', post.id);
      data.set('user', currentUser.user);
      const commentAPI = ENDPOINTS.COMMENT();
      const response = await api.post(commentAPI, data);
      setContent('');
      setReplying(null);
      submitExtraActions();
    }
  };
  const handleChange = (e) => {
    const val = e.target.value;
    const words = val.trim().split(/\s+/);
    // console.log(words);
    const cnt = words.length;

    if (words.length <= maxWordCnt) {
      setContent(val);
      setWordCnt(cnt);
    }
  };
  return (
    <BS.Form id="comment-form" onSubmit={handleSubmit}>
      <BS.Form.Group>
        <BS.Form.Text>{replying ? 'Replying to:' : 'Comment'}</BS.Form.Text>
        {replying && (
          <>
            <div className="d-flex w-100 flex-row gap-2 my-2">
              <div className="vr" />
              <div className="w-100 d-flex flex-column p-2 bg-secondary-subtle position-relative">
                <small>{replying.user_userinfo.display_name}:</small>
                <span>{replying.comment}</span>
                <a
                  className="text-danger position-absolute my-auto end-0 top-50 translate-middle"
                  href="javascript:void(0)"
                  // variant="danger"
                  onClick={() => setReplying(null)}
                >
                  <BSIcon.XLg />
                </a>
              </div>
            </div>
            <BS.Form.Control name="parent" type="hidden" value={replying.id} />
          </>
        )}
        <BS.Form.Control
          ref={commentRef}
          as="textarea"
          name="comment"
          type="text"
          value={content}
          onChange={handleChange}
        />
        <BS.Form.Text muted>{maxWordCnt - wordCnt} words left</BS.Form.Text>
      </BS.Form.Group>
      <BS.Button type="submit" variant="primary">
        Submit
      </BS.Button>
    </BS.Form>
  );
};
