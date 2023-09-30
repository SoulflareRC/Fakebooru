import React, { useRef } from 'react';
import { PencilSquare } from 'react-bootstrap-icons';

import api from '../../api';
import { useProfileContext } from '../../context';
import { ImageInput } from '../utils';
import { ENDPOINTS } from 'endpoints';
export const ProfileFormCard = ({ profile, currentUser }) => {
  // const [edit,setEdit] = useState(false);
  const { edit, setEdit } = useProfileContext();
  const bgRef = useRef(null);
  const iconRef = useRef(null);
  const handleSubmit = async (e) => {
    console.log('Submitting...');
    const userDataAPI = ENDPOINTS.USERINFO(`${currentUser.id}/`);
    e.preventDefault();
    const formData = new FormData(e.target);
    console.log('Formdata:', formData.files);
    const response = await api.patch(userDataAPI, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log('Response:', response.status);
    setEdit(false);
  };

  return (
    <form
      action=""
      className="d-grid gap-2 position-relative"
      disabled={!edit}
      encType="multipart/form-data"
      method="post"
      onSubmit={handleSubmit}
    >
      {currentUser && currentUser.id === profile.id && (
        <div className="position-absolute z-3 top-0 end-0 text-white btn">
          <div className="btn text-white" onClick={() => setEdit(!edit)}>
            <PencilSquare />
          </div>
        </div>
      )}
      <div
        className=" text-light position-relative border rounded bg overflow-hidden justify-content-center d-flex flex-column"
        style={{ height: '30vh' }}
      >
        <img
          ref={bgRef}
          alt="No background"
          className="w-100 position-absolute "
          id="bg-preview"
          src={profile.profile_bg}
        />

        <label
          className="justify-content-center d-flex flex-column h-100 w-100 m-0 z-2"
          data-bs-title="Click to upload image"
          data-bs-toggle="tooltip"
          disabled={!edit}
          htmlFor="bg-input"
          style={{
            background:
              'linear-gradient(0deg, rgba(255,255,255,0.5) 0%, rgba(88,88,105,0.3) 35%, rgba(0,0,0,0.5) 100%)',
          }}
        >
          <div className=" justify-content-center d-flex flex-column" style={{ height: '30%' }}>
            <div className="h-100">
              <label
                className="icon-wrap shadow z-3"
                data-bs-title="Click to upload image"
                data-bs-toggle="tooltip"
                disabled={!edit}
                htmlFor="icon-input"
              >
                <img ref={iconRef} alt="No Icon" id="icon-preview" src={profile.icon} />
              </label>
            </div>
          </div>
          <div className="mt-1 text-center  w-100">
            <input
              className={`w-50 mx-auto text-light m-0 p-0 bg-transparent  border-0 fs-5 form-control ${
                edit ? 'border-bottom' : ''
              }`}
              defaultValue={profile.display_name}
              disabled={!edit}
              maxLength="50"
              name="display_name"
              required
              style={{
                textAlign: 'center',
              }}
              type="text"
            />
          </div>
          <div className="mt-2 text-center w-100">
            <input
              className={`w-75 mx-auto text-light m-0 p-0 bg-transparent border-0 form-control ${
                edit ? 'border-bottom' : ''
              }`}
              defaultValue={profile.slogan}
              disabled={!edit}
              maxLength="100"
              name="slogan"
              placeholder={edit ? 'Leave your famous quote...' : ''}
              style={{
                textAlign: 'center',
              }}
              type="text"
            />
          </div>
        </label>
      </div>
      {edit && (
        <div className="border rounded btn-group">
          <div className="btn btn-outline-secondary" onClick={() => setEdit(false)}>
            Cancel
          </div>
          <button className="btn btn-outline-primary" type="submit">
            Save
          </button>
        </div>
      )}
      <ImageInput
        className="d-none"
        disabled={!edit}
        id="bg-input"
        imgRef={bgRef}
        name="profile_bg"
      />
      <ImageInput
        className="d-none"
        disabled={!edit}
        id="icon-input"
        imgRef={iconRef}
        name="icon"
      />
      {/* <input name="user" type="hidden" value={profile.user} /> */}
    </form>
  );
};
