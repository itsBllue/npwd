import React, { useState } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { useTranslation } from 'react-i18next';
import { useNuiRequest } from 'fivem-nui-react-lib';
import ProfileField from '../../../../ui/components/ProfileField';
import { useProfile } from '../../hooks/useProfile';
import ProfileUpdateButton from '../buttons/ProfileUpdateButton';
import { useRecoilValue } from 'recoil';
import { twitterState } from '../../hooks/state';
import { usePhone } from '../../../../os/phone/hooks/usePhone';
import { TwitterEvents } from '../../../../../../typings/twitter';
import DefaultProfilePrompt from './DefaultProfilePrompt';

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'relative',
    width: '100%',
    height: '100%',
    padding: '15px',
  },
  spacer: {
    height: '8px',
  },
}));

export function ProfilePrompt() {
  const Nui = useNuiRequest();
  const classes = useStyles();
  const { t } = useTranslation();
  const { profile } = useProfile();
  const defaultProfileNames = useRecoilValue(twitterState.defaultProfileNames);
  const [profileName, setProfileName] = useState(profile?.profile_name || '');
  const { ResourceConfig } = usePhone();

  const showDefaultProfileNames = !ResourceConfig.twitter.allowEditableProfileName && !profile;
  const eventName = showDefaultProfileNames
    ? TwitterEvents.CREATE_PROFILE
    : TwitterEvents.UPDATE_PROFILE;

  const handleUpdate = () => {
    Nui.send(eventName, {
      ...profile,
      profile_name: profileName,
    });
  };

  // case where profile doesn't exist, couldn't be created automatically
  // and the player is not allowed to edit their own profile name
  if (showDefaultProfileNames) {
    return (
      <DefaultProfilePrompt
        profileName={profileName}
        defaultProfileNames={defaultProfileNames}
        setProfileName={setProfileName}
        handleUpdate={handleUpdate}
      />
    );
  }

  // case where profile doesn't exist, couldn't be created automatically
  // but the player IS allowed to edit their own profile name
  return (
    <div className={classes.root}>
      <ProfileField
        label={t('APPS_TWITTER_EDIT_PROFILE_NAME')}
        value={profileName}
        handleChange={setProfileName}
        allowChange
      />
      <ProfileUpdateButton handleClick={handleUpdate} />
    </div>
  );
}

export default ProfilePrompt;
