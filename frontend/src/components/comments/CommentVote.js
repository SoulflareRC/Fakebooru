import React, { useState, useEffect } from 'react';
import * as BS from 'react-bootstrap';
import * as BSIcon from 'react-bootstrap-icons';

import api from '../../api';
import { useGlobalContext } from '../../context';
import { ENDPOINTS } from 'endpoints';
export const CommentVote = ({ comment }) => {
  const { currentUser, loading, setLoading } = useGlobalContext();
  const [vote, setVote] = useState(null);
  // const {fetchPost} = useSinglePostContext();
  const fetchVote = async (comment_id, user_id) => {
    const queryParams = new URLSearchParams();
    const voteAPI = ENDPOINTS.VOTE();
    queryParams.set('by', user_id);
    queryParams.set('comment', comment_id);
    const response = await api.get(`${voteAPI}?${queryParams.toString()}`);
    const data = response.data.results[0];
    // console.log("Got vote!",data);
    setVote(data);
  };
  useEffect(() => {
    if (comment && comment.id && currentUser && currentUser.user) {
      // console.log("Fetching vote from:",comment.id,currentUser.user);
      fetchVote(comment.id, currentUser.user);
    }
  }, [comment, currentUser]);
  const voteComment = async (newVote) => {
    // new Vote x existing vote:
    // if new==old--> 0
    // if new!=old--> new
    let finalVote = newVote;
    if (vote) {
      if (vote.vote === newVote) finalVote = 0;
      else finalVote = newVote;
    }
    // console.log("Final vote:",finalVote);
    const data = new FormData();
    data.set('by', currentUser.user);
    data.set('comment', comment.id);
    data.set('vote', finalVote);
    const voteAPI = ENDPOINTS.VOTE();
    const response = await api.post(voteAPI, data);
    setVote({ ...vote, vote: finalVote });
    // fetchPost(comment.object_pk);
  };
  if (!currentUser) return null;
  return (
    <span>
      <a href="javascript:void(0)" onClick={() => voteComment(1)}>
        {vote && vote.vote === 1 ? <BSIcon.CaretUpFill /> : <BSIcon.CaretUp />}
      </a>{' '}
      {comment.total_vote}{' '}
      {/* {vote?vote.vote} */}
      <a href="javascript:void(0)" onClick={() => voteComment(-1)}>
        {vote && vote.vote === -1 ? <BSIcon.CaretDownFill /> : <BSIcon.CaretDown />}
      </a>
    </span>
  );
};
