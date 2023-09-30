import React, { useContext, useEffect, useReducer, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { ENDPOINTS } from './endpoints';
import api from './api';

const AppContext = React.createContext();
const AppProvider = ({ children }) => {
  const nav = useNavigate();
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  // const currentUserEndpoint = process.env.REACT_APP_API_BASE_URL + '/api/user/current';
  const userDataEndpoint = ENDPOINTS.USERINFO("current");
  const fetchCurrentUserData = async () => {
    setLoading(true);
    try{
      const userData = await await (await api.get(`${userDataEndpoint}`)).data;
      console.log('Current User data:', userData);
      if(userData.error)setCurrentUser(null);
      setCurrentUser(userData);
      return userData;
    }catch (error){
      if(error.response){
        console.log(error.response); 
      }
    }
    setLoading(false);
     
  };
  useEffect(() => {
    fetchCurrentUserData();
  }, []);
  console.log('Hello from context!');
  return (
    <AppContext.Provider
      value={{
        currentUser,
        loading,
        setLoading,
        fetchCurrentUserData,
        setCurrentUser, 
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
export const useGlobalContext = () => {
  return useContext(AppContext);
};
export const TagContext = React.createContext();
export const TagProvider = ({ children }) => {
  console.log('Using Tag context!');
  const [tags, setTags] = useState({}); // tags shown in taglist
  const [tagifyTags, setTagifyTags] = useState([]); // tags used in tagify
  const navigate = useNavigate();
  const fetchTags = async (url) => {
    const response = await api.get(url);
    return response.data.results; // don't directly set tags
  };
  const searchTags = async (query) => {
    const tagAPI = ENDPOINTS.TAG();
    const search = `search=${query}`;
    const url = `${tagAPI}?${search}`;
    return await fetchTags(url);
  };
  const queryWithTags = async (tags) => {
    const queryParams = new URLSearchParams();
    if (tags.length) {
      tags.forEach((tag) => {
        queryParams.append('tags', tag);
      });
    }
    navigate({
      pathname: '/',
      search: queryParams.toString(),
    });
  };
  const sortTags = (tags) => {
    const tagsByCat = {};
    tags.forEach((tag) => {
      const cat = tag.category;
      if (!tagsByCat[cat]) tagsByCat[cat] = [];
      tagsByCat[cat].push(tag);
    });
    console.log(tagsByCat);
    const cats = Object.keys(tagsByCat);
    cats.forEach((key) => {
      tagsByCat[key].sort((a, b) => {
        return b.post_cnt - a.post_cnt;
      });
      tagsByCat[key] = tagsByCat[key].slice(0, 15);
    });
    return tagsByCat;
  };
  const flattenTags = (tags) => {
    const tagsList = [];
    Object.keys(tags).forEach((key) => {
      tagsList.concat(tags[key]);
    });
    return tagsList;
  };
  return (
    <TagContext.Provider
      value={{
        tags,
        setTags,
        fetchTags,
        searchTags,
        tagifyTags,
        setTagifyTags,
        sortTags,
        queryWithTags,
        flattenTags,
      }}
    >
      {children}
    </TagContext.Provider>
  );
};
export const useTagContext = () => {
  return useContext(TagContext);
};
export const PostContext = React.createContext();
export const PostProvider = ({ children }) => {
  console.log('Using Post context!');
  // const state = {
  //   posts:[],//posts displayed on the current page
  //   // order:"publish_date",//posts ordered by this // cancelled since implementation moved to using query params
  // }
  const page_size = 30;
  const [order, setOrder] = useState('-publish_date');
  const [posts, setPosts] = useState([]);
  const [postCnt, setPostCnt] = useState(0);
  const [postTags, setPostTags] = useState([]);
  const [active, setActive] = useState(0); // active page
  // const [tags,setTags] = useState([]) // tags shown in taglist
  // const [tagifyTags,setTagifyTags] = useState([]); // tags used in tagify
  const fetchPosts = async (url) => {
    console.log('Fetching posts from url:', url);
    try{
      const response = await api.get(url);
      const data = await response.data;
      const posts = data.results;
      const { unique_tags } = data;
      console.log('Response:', response);
      console.log('Got posts:', posts);
      setPosts(posts);
      setPostTags(unique_tags);
    }catch (error){
      if(error.response){
        console.log("Error:",error.response);
      }
    }
    
  };
  const postCntAPI = ENDPOINTS.POST('count/');
  const fetchPostCnt = async (query) => {
    const response = await api.get(`${postCntAPI}?${query}`);
    console.log(response);
    setPostCnt(response.data);
  };
  return (
    <PostContext.Provider
      value={{
        posts,
        setPosts,
        fetchPosts,
        // tags,setTags, tagifyTags,setTagifyTags,
        postCnt,
        fetchPostCnt,
        active,
        setActive,
        page_size,
        order,
        setOrder,
        postTags,
        setPostTags,
      }}
    >
      {children}
    </PostContext.Provider>
  );
};
export const usePostContext = () => {
  return useContext(PostContext);
};
export const PostWrapper = ({ element }) => {
  return <PostProvider>{element}</PostProvider>;
};
export const SinglePostContext = React.createContext();
export const SinglePostProvider = ({ children }) => {
  const [post, setPost] = useState(null);
  const [editing, setEditing] = useState(false);
  const fetchPost = async (id) => {
    const postAPI = ENDPOINTS.POST(id);
    const response = await api.get(postAPI);
    const { data } = response;
    console.log(data);
    setPost(data);
  };
  return (
    <SinglePostContext.Provider
      value={{
        post,
        setPost,
        fetchPost,
        editing,
        setEditing,
      }}
    >
      {children}
    </SinglePostContext.Provider>
  );
};
export const useSinglePostContext = () => {
  return useContext(SinglePostContext);
};
const ProfileContext = React.createContext();
export const ProfileProvider = ({ children }) => {
  // for user profile
  const [profile, setProfile] = useState(null);
  const [edit, setEdit] = useState(false);
  const fetchProfile = async (id) => {
    const profileAPI = ENDPOINTS.PROFILE(`${id}/`);
    const response = await api.get(profileAPI);
    const { data } = response;
    // console.log(data);
    setProfile(data);
    console.log('Got profile data:', data);
  };
  return (
    <ProfileContext.Provider
      value={{
        profile,
        setProfile,
        fetchProfile,
        edit,
        setEdit,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};
export const useProfileContext = () => {
  return useContext(ProfileContext);
};
const SingleTagContext = React.createContext();
export const SingleTagProvider = ({ children }) => {
  const [tag, setTag] = useState({});
  const [edit, setEdit] = useState(false);
  const fetchTag = async (id) => {
    const tagAPI = ENDPOINTS.TAG(id);
    const response = await api.get(tagAPI);
    const tag = response.data;
    setTag(tag);
  };
  return (
    <SingleTagContext.Provider
      value={{
        tag,
        setTag,
        edit,
        setEdit,
        fetchTag,
      }}
    >
      {children}
    </SingleTagContext.Provider>
  );
};
export const useSingleTagContext = () => {
  return useContext(SingleTagContext);
};

export const CommentContext = React.createContext();
export const CommentProvider = ({ children }) => {
  const [comments, setComments] = useState([]);
  const [replying, setReplying] = useState(null);
  const [commenting, setCommenting] = useState(-1);
  const fetchComments = async (url) => {
    const response = await api.get(url);
    const comments = response.data.results;
    console.log('Fetched comments:', comments);
    setComments(comments);
  };
  const delCommentHelper = (comments,id) => {
    // this returns the comments with the comment of id deleted
    if(!comments)return comments;  
    for(let i = 0;i<comments.length;i++){
      let comment = comments[i]; 
      if(comment.id==id){
        console.log("Found target, deleting ",id); 
        return comments.filter((c)=>c.id!=id); 
      }
        
      // if found the target comment at this level, then just return filtered comments
      comments[i].children = delCommentHelper(comment.children,id); 
      // dfs
    }
    return comments; 
  }
  const delComment = async (id) => {
    const commentAPI =ENDPOINTS.COMMENT(`${id}/`);
    console.log('Old comments:', comments);
    const response = await api.delete(commentAPI);
    /* Search  */
    // const newComments = comments.filter((comment) => comment.id != id);
    const newComments = delCommentHelper(comments,id); 
    console.log('New comments:', newComments);
    setComments(newComments);
  };
  return (
    <CommentContext.Provider
      value={{
        comments,
        setComments,
        fetchComments,
        delComment,
        // fetchComment,
        replying,
        setReplying,
        commenting,
        setCommenting,
      }}
    >
      {children}
    </CommentContext.Provider>
  );
};
export const useCommentContext = () => {
  return useContext(CommentContext);
};
export { AppContext, AppProvider };
