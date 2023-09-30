import React from 'react';
// import { Provider } from 'react-redux';

// import Home from './pages/Home';
// import configureStore from './store';
// import SentryBoundary from './utils/SentryBoundary';
import { Route, Routes} from 'react-router-dom';
import { ReqAuth } from 'utils/auth';
import { Navbar } from './components';
import * as Pages from './pages';
import {
  AppProvider,
  useGlobalContext,
  TagProvider,
  PostProvider,
  SinglePostProvider,
  ProfileProvider,
  SingleTagProvider,
  CommentProvider,
} from './context';
// import { SpinnerPage } from './app/example-app/components/Loading';
import { SpinnerPage } from './components/utils';
import { isAuthenticated } from 'utils/auth';
const App = () => {
  return (
    // <SentryBoundary>
      // {/* <Provider store={store}> */}
      <AppProvider>
        <Navbar.MyNavbar />
        <main className="">
          <Routes>
            <Route
              path="/"
              element={
                <PostProvider>
                  <TagProvider>
                    <Pages.Posts />
                  </TagProvider>
                </PostProvider>
              }
            ></Route>
            <Route
              path="/tag"
              element={
                <TagProvider>
                  <Pages.TagsPage />
                </TagProvider>
              }
            ></Route>
            <Route
              path="/comments"
              element={
                <CommentProvider>
                  <Pages.CommentsPage />
                </CommentProvider>
              }
            ></Route>
            <Route
              path="/tag/:id"
              element={
                <SingleTagProvider>
                  <Pages.TagPage />
                </SingleTagProvider>
              }
            ></Route>
            <Route
              path="/post/:id"
              element={
                <SinglePostProvider>
                  <TagProvider>
                    <CommentProvider>
                      <Pages.Post />
                    </CommentProvider>{' '}
                  </TagProvider>
                </SinglePostProvider>
              }
            ></Route>
            <Route
              path="/post/create"
              element={
                <ReqAuth>
                <TagProvider>
                  <Pages.PostCreate />
                </TagProvider>
                </ReqAuth>
              }
            />
            <Route
              path="/profile/:id"
              element={
                  <ProfileProvider>
                    <Pages.ProfileCombined />
                  </ProfileProvider>
              }
            ></Route>
            <Route path='accounts' >
              <Route path='login' element={
                <ReqAuth req={false}>
                <Pages.Login/>
                </ReqAuth>
              }/>
              <Route path='register' element={
                <ReqAuth req={false}>
                  <Pages.Register/>
                </ReqAuth>
              }/>
              <Route path='logout' element={
                <ReqAuth>
                  <Pages.Logout/>
                </ReqAuth>
              }/>
              <Route path="email-sent" element={
                <Pages.EmailSent/>
              }/>
              <Route path="email-confirm" element={
                <Pages.EmailConfirm/>
              }/>
              <Route path='password-reset-request' element={
                <Pages.PasswordResetRequest/>
              }/>
              <Route path='password-reset-confirm' element={
                <Pages.PasswordResetConfirm/>
              }/>
            </Route>
          </Routes>
        </main>
      </AppProvider>
  );
};

export default App;
