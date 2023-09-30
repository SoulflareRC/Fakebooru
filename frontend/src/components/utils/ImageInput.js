import React from 'react';

export const ImageInput = ({ imgRef, className, id, name, disabled }) => {
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.addEventListener('load', (e) => {
        imgRef.current.src = e.target.result;
      });
      reader.readAsDataURL(file);
    }
  };
  return (
    <input
      className={className}
      disabled={disabled}
      id={id}
      name={name}
      type="file"
      onChange={handleFileChange}
    />
  );
};
