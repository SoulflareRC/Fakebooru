import React from 'react';
import { Tabs, Tab, Col, Row, Badge } from 'react-bootstrap';

import { TAG_TYPES } from '../../constants';
import { PostListRow } from '../posts';

export const ProfileStats = ({ profile }) => {
  return (
    <Tabs className="mb-3" defaultActiveKey="posts" justify>
      <Tab eventKey="posts" title="posts">
        <h4>Favorited</h4>
        <hr />
        <PostListRow posts={profile.posts_fav} />
        {/* <Row className='overflow-hidden' >
                    <div className='d-flex flex-nowrap overflow-x-auto m-2'>
                    {profile.posts_fav.map((post)=>{
                        return <Col xs="auto"><SinglePost post={post}/></Col>
                    })}
                    </div>
                </Row> */}
        <br />
        <h4>Uploaded</h4>
        <hr />
        <PostListRow posts={profile.posts_upload} />
        {/* <Row className='overflow-hidden'>
                <div className='d-flex flex-nowrap overflow-x-scroll m-2' >
                    {profile.posts_upload.map((post)=>{
                        return <Col xs="auto"><SinglePost post={post}/></Col>
                    })}
                </div>
                </Row> */}
      </Tab>
      <Tab eventKey="stats" title="Stats">
        <h4>Stats</h4>
        <hr />
        <Row>
          <Col>
            <span>
              <strong>Posts:</strong> {profile.posts_upload.length}
            </span>
          </Col>
          <Col>
            <span>
              <strong>Likes:</strong> {profile.stats_likes}
            </span>
          </Col>
          <Col>
            <span>
              <strong>Average score:</strong> {profile.stats_posts_score_avg}
            </span>
          </Col>
        </Row>
        <br />
        <h4>Tags</h4>
        <hr />
        <p>
          <strong>Uploaded tags: </strong>
          {profile.stats_tags_upload.map((tag) => {
            const color = TAG_TYPES.toColor(tag.category);
            return (
              <Badge key={tag.id} bg={color}>
                <a>{tag.name}</a> <Badge bg="secondary">{tag.post_cnt}</Badge>
              </Badge>
            );
          })}
        </p>
        <p>
          <strong>Liked tags: </strong>
          {profile.stats_tags_fav.map((tag) => {
            const color = TAG_TYPES.toColor(tag.category);
            return (
              <Badge key={tag.id} bg={color} className="mx-1">
                <a>{tag.name}</a> <Badge bg="secondary">{tag.post_cnt}</Badge>
              </Badge>
            );
          })}
        </p>
      </Tab>
      <Tab eventKey="contact" title="Contact" />
    </Tabs>
  );
};
