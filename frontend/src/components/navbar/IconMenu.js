import React from 'react';
import { Nav, Dropdown } from 'react-bootstrap';

import { useGlobalContext } from '../../context';

const IconToggle = React.forwardRef(({ children, onClick }, ref) => {
  const { currentUser } = useGlobalContext();
  if (!currentUser) return null;
  return (
    // <div className='btn'>
    <div
      ref={ref}
      className="h-100 w-100 btn  justify-content-center align-items-center d-flex gap-2 overflow-hidden"
      onClick={onClick}
    >
        <a
          className="icon-wrap outline outline-white border border-primary"
          style={{
            height: '4vh',
          }}
        >
          <img alt="No Icon" src={currentUser.icon} />
        </a>
        {children}
      <div className="d-flex align-items-center fs-bold">{currentUser.display_name}</div>
    </div>
  );
});
IconToggle.displayName = 'IconToggle';
export const IconMenu = () => {
  const { currentUser } = useGlobalContext();
  if (!currentUser||currentUser.error) return <Nav.Link href="/accounts/login">Sign in</Nav.Link>;

  return (
    <Dropdown className="h-100 w-100">
      <Dropdown.Toggle as={IconToggle} id="dropdown-basic" variant="n" />
      <Dropdown.Menu className='w-100'>
        <Dropdown.Item href={`/profile/${currentUser.id}`}>My Profile</Dropdown.Item>
        <Dropdown.Divider/>
        <Dropdown.Item href="/accounts/logout" className="text-danger">Sign out</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};
