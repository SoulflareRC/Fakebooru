import Tagify from '@yaireo/tagify';
// import Tags from '@yaireo/tagify/dist/react.tagify';
import React, { useRef, useEffect } from 'react';

// import api from '../../api';
import { useTagContext } from '../../context';

export const TagifyInput = ({ placeholder, handleSubmit = (tags) => {} }) => {
  // handleSubmit takes in the tags in the tagify component
  const { searchTags, tagifyTags, setTagifyTags } = useTagContext();
  const tagifyRef = useRef(null);
  const tagify = useRef(null);
  const updateWhitelist = async (query) => {
    const tags_data = await searchTags(query);
    console.log('tags data:', tags_data);
    const tags = tags_data.map((x) => x.name);
    tagify.current.whitelist = tags;
    tagify.current.dropdown.show();
  };
  useEffect(() => {
    const baseTagifySettings = {
      maxTags: 20,
      whitelist: [],
      placeholder: 'Search tags',
      dropdown: {
        enabled: 0, // a;ways show suggestions dropdown
        maxItems: 15,
        position: 'text',
        highlightFirst: true,
      },
      // originalInputValueFormat: valuesArr => valuesArr.map(tag=>tag.value).join('+')
    };
    tagify.current = new Tagify(tagifyRef.current, baseTagifySettings);

    const handleInput = async (e) => {
      console.log('Input value:', e.detail);
      const query = e.detail.value;
      console.log('Query:', query);
      // searchTags(query);
      updateWhitelist(query);
    };
    const handleEnter = (e) => {
      const { key } = e.detail.event;
      if (key === 'Enter' && !tagify.current.state.inputText && !tagify.current.state.editing) {
        console.log('Submit and query!');
        console.log(tagify.current.state.inputText);
        console.log(tagify.current.state.editing);
        handleSubmit(tagifyTags);
      }
    };
    const handleChange = (e) => {
      // console.log(tagify.current);
      // console.log("Tagify input changed!"+tagify.current.value);
      const tags = tagify.current.value.map((tag) => tag.value);
      console.log(tags);
      setTagifyTags(tags);
    };
    tagify.current.on('keydown', handleEnter);
    tagify.current.on('input', handleInput);
    tagify.current.on('change', handleChange);
    return () => {
      tagify.current.off('keydown', handleEnter);
      tagify.current.off('input', handleInput);
      tagify.current.off('change', handleChange);
      // to prevent attaching multiple listeners.
      tagify.current.destroy();
    };
  }); // add event listeners
  useEffect(() => {
    tagify.current.removeAllTags();
    tagify.current.addTags(tagifyTags);
    console.log('Tagify tags updated:', tagifyTags);
  }, [tagifyTags]); // add tag through clicking pills
  return (
    <input
      ref={tagifyRef}
      aria-label="tag"
      autoComplete="off"
      className="form-control"
      name="tags"
      placeholder={placeholder || 'Search for tag'}
      type="text"
    />
  );
};
