import React from 'react';
import { Nav, Navbar } from 'react-bootstrap';

import { IconMenu } from './IconMenu';

export const MyNavbar = () => {
  return (
    <Navbar className="navbar-primary p-2" expand="lg">
      <Navbar.Brand href="/">
        <span className="p-1 fs-4">Soulflare</span>
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav
          className="mx-auto gap-1 position-relative d-flex justify-content-center align-items-center "
          style={
            {
              // height:"6vh",
            }
          }
        >
          <Nav.Link href="/">Browse</Nav.Link>
          <Nav.Link href="/post/create">Upload</Nav.Link>
          <Nav.Link href="/tag">Tags</Nav.Link>
          <Nav.Link href="/comments">Comments</Nav.Link>
          {/* <SearchBar></SearchBar>  */}
          <IconMenu />
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};
