import React, { useState } from 'react';
import { Switch, Route } from 'react-router-dom';
import makeStyles from '@mui/styles/makeStyles';

import { AppWrapper } from '../../../ui/components';
import { AppContent } from '../../../ui/components/AppContent';
import TweetListContainer from './tweet/TweetListContainer';
import AddTweetModal from './AddTweetModal';
import { useModal } from '../hooks/useModal';
import TweetButton from './buttons/TweetButton';
import TwitterTitle from './TwitterTitle';
import BottomNavigation from './BottomNavigation';
import TwitterProfile from './profile/Profile';
import TwitterSearch from './TwitterSearch';

import './twitter.css';
import 'emoji-mart/css/emoji-mart.css';
import { useProfile } from '../hooks/useProfile';
import ProfilePrompt from './profile/ProfilePrompt';
import InjectDebugData from '../../../os/debug/InjectDebugData';
import { TwitterThemeProvider } from '../providers/TwitterThemeProvider';
import { TwitterEvents } from '../../../../../typings/twitter';

const useStyles = makeStyles(() => ({
  backgroundModal: {
    background: 'black',
    opacity: '0.6',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 5,
  },
}));

export const TwitterApp = () => {
  const classes = useStyles();
  const { modalVisible, setModalVisible } = useModal();
  const [activePage, setActivePage] = useState(0);
  const { profile } = useProfile();

  // before any other action can be taken by the user we force
  // them have a profile name.
  const promptProfileName = !profile || !profile.profile_name || !profile.profile_name.trim();

  const openModal = () => setModalVisible(true);
  const handlePageChange = (e, page) => setActivePage(page);
  const showTweetButton = !promptProfileName && activePage === 0;

  return (
    <TwitterThemeProvider>
      <AppWrapper id="twitter-app">
        <AddTweetModal />
        <div className={modalVisible ? classes.backgroundModal : undefined} />
        <TwitterTitle />
        <AppContent>
          {promptProfileName ? (
            <ProfilePrompt />
          ) : (
            <Switch>
              <Route path="/twitter" exact component={TweetListContainer} />
              <Route path="/twitter/search" component={TwitterSearch} />
              <Route path="/twitter/profile" component={TwitterProfile} />
            </Switch>
          )}
        </AppContent>
        {showTweetButton && <TweetButton openModal={openModal} />}
        {!promptProfileName && (
          <BottomNavigation activePage={activePage} handleChange={handlePageChange} />
        )}
      </AppWrapper>
    </TwitterThemeProvider>
  );
};

InjectDebugData([
  {
    app: 'TWITTER',
    method: TwitterEvents.GET_OR_CREATE_PROFILE,
    data: {
      profile_name: 'Angular_Dev',
      bio: 'Angular FTW',
      job: 'Googler @ Google',
      location: '1600 Amphitheatre Parkway, CA, USA',
      avatar_url: 'https://i.tasoagc.dev/i9Ig',
    },
  },
  {
    app: 'TWITTER',
    method: TwitterEvents.FETCH_TWEETS,
    data: [
      {
        id: 59,
        message: 'XSS\n<script src="test.js">Test</script>\nBro',
        avatar_url: 'http://i.tasoagc.dev/jtKL',
        seconds_since_tweet: 500,
        isMine: false,
        isRetweetedByPlayer: true,
        updateAt: '2021-02-08 14:37:46',
        visible: 1,
        likes: 50000,
        profile_name: 'jQuery Main',
        images: 'http://i.tasoagc.dev/0xdp',
      },
      {
        id: 2,
        message: 'GCPhone will never die',
        avatar_url: 'http://i.tasoagc.dev/jtKL',
        seconds_since_tweet: 500,
        isMine: false,
        updateAt: '2021-02-08 14:37:46',
        visible: 1,
        likes: 50000,
        profile_name: 'GCPhone_v9999',
        images: 'http://i.tasoagc.dev/0xdp',
      },
      {
        id: 1,
        message: 'I love angular',
        avatar_url: 'https://i.tasoagc.dev/i9Ig',
        seconds_since_tweet: 800,
        isMine: true,
        updateAt: '2021-02-08 14:37:46',
        visible: 1,
        likes: 50000,
        profile_name: 'Angular_Dev',
        images: 'http://i.tasoagc.dev/i9Ig',
      },
      {
        id: 3,
        message:
          'Anyways uhm... I bought a whole bunch of shungite, rocks, ' +
          'do you know what shungite is? Anybody know what shungite is. No, no ' +
          'Suge Knight, I think hes locked up in prison.',
        avatar_url: 'http://i.tasoagc.dev/0v64',
        seconds_since_tweet: 800,
        isMine: true,
        updateAt: '2021-02-08 14:37:46',
        visible: 1,
        likes: 50000,
        profile_name: 'The_Doc',
      },
    ],
  },
]);

InjectDebugData(
  [
    {
      app: 'TWITTER',
      method: TwitterEvents.CREATE_TWEET_BROADCAST,
      data: {
        id: 111,
        profile_id: 111,
        profile_name: 'Kidz',
        isMine: false,
        isReported: false,
        message: 'I have tweeted this because Im badass',
      },
    },
    {
      app: 'TWITTER',
      method: TwitterEvents.CREATE_TWEET_BROADCAST,
      data: {
        id: 111,
        profile_id: 111,
        profile_name: 'ItsChip',
        isMine: false,
        isReported: false,
        message:
          'I have tweeted this because Im even more badass... And I need this to be longer so I will continue to write',
      },
    },
  ],
  3000,
);
