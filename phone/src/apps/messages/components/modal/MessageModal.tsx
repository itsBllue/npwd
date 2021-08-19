import React, { useEffect, useState } from 'react';
import {
  Slide,
  Paper,
  Typography,
  Button,
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import useStyles from './modal.styles';
import useMessages from '../../hooks/useMessages';
import Conversation, { CONVERSATION_ELEMENT_ID } from './Conversation';
import MessageSkeletonList from './MessageSkeletonList';
import { useNuiRequest } from 'fivem-nui-react-lib';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Modal from '../../../../ui/components/Modal';
import { useContactActions } from '../../../contacts/hooks/useContactActions';
import { useMyPhoneNumber } from '../../../../os/simcard/hooks/useMyPhoneNumber';
import { Message, MessageEvents } from '../../../../../../typings/messages';
import { fetchNui } from '../../../../utils/fetchNui';
import { ServerPromiseResp } from '../../../../../../typings/common';
import { MockConversationMessages } from '../../utils/constants';
import { isEnvBrowser } from '../../../../utils/misc';

const LARGE_HEADER_CHARS = 30;
const MAX_HEADER_CHARS = 80;
const MINIMUM_LOAD_TIME = 600;

const memberDisplay = (display, number, myNumber, t) => {
  if (myNumber === number) {
    return (
      <span>
        {t('APPS_MESSAGES_ME')} ({number})
      </span>
    );
  }
  if (display !== number) {
    return (
      <span>
        {display} ({number})
      </span>
    );
  }
  return <span>{number}</span>;
};

export const MessageModal = () => {
  const Nui = useNuiRequest();
  const classes = useStyles();
  const history = useHistory();
  const myNumber = useMyPhoneNumber();
  const { pathname } = useLocation();
  const { t } = useTranslation();
  const { groupId } = useParams<{ groupId: string }>();
  const { messages, setMessages, activeMessageConversation, setActiveMessageConversation } =
    useMessages();
  const { getContactByNumber, getDisplayByNumber } = useContactActions();

  const [isLoaded, setLoaded] = useState(false);

  useEffect(() => {
    if (activeMessageConversation && messages) {
      setTimeout(() => {
        setLoaded(true);
      }, MINIMUM_LOAD_TIME);
      return;
    }
    setLoaded(false);
  }, [activeMessageConversation, messages]);

  const [groupActionsOpen, setGroupActionsOpen] = useState(false);

  const closeModal = () => {
    history.push('/messages');
    setMessages(null);
  };

  useEffect(() => {
    if (!groupId) return;
    setActiveMessageConversation(groupId);
  }, [groupId, setActiveMessageConversation]);

  useEffect(() => {
    if (isLoaded && messages) {
      const element = document.getElementById(CONVERSATION_ELEMENT_ID);
      if (element) {
        element.scrollTop = element.scrollHeight;
      }
    }
  }, [isLoaded, messages]);

  // sends all unread messages
  useEffect(() => {
    if (activeMessageConversation?.conversation_id) {
      Nui.send(MessageEvents.SET_MESSAGE_READ, {
        groupId: activeMessageConversation.conversation_id,
      });
    }
  }, [activeMessageConversation, Nui]);

  // don't allow too many characters, it takes too much room
  let header = activeMessageConversation.display || activeMessageConversation.phoneNumber;
  const truncatedHeader = `${header.slice(0, MAX_HEADER_CHARS).trim()}...`;
  header = header.length > MAX_HEADER_CHARS ? truncatedHeader : header;

  const headerClass =
    header.length > LARGE_HEADER_CHARS ? classes.largeGroupDisplay : classes.groupdisplay;

  const handleAddContact = (number) => {
    const exists = getContactByNumber(number);
    const referal = encodeURIComponent(pathname);
    if (exists) {
      return history.push(`/contacts/${exists.id}/?referal=${referal}`);
    }
    return history.push(`/contacts/-1/?addNumber=${number}&referal=${referal}`);
  };

  const targetNumber = activeMessageConversation.phoneNumber;

  return (
    <div>
      <Slide direction="left" in={!!activeMessageConversation}>
        <Paper className={classes.modalRoot}>
          <Paper className={classes.conversationHeader}>
            <Box display="flex" justifyContent="space-between">
              <Button onClick={closeModal}>
                <ArrowBackIcon fontSize="large" />
              </Button>
              <Typography variant="h5" className={headerClass}>
                {header}
              </Typography>
              {getDisplayByNumber(targetNumber) === targetNumber ? (
                <Button>
                  <PersonAddIcon onClick={() => handleAddContact(targetNumber)} fontSize="large" />
                </Button>
              ) : null}
            </Box>
          </Paper>
          {isLoaded && activeMessageConversation ? (
            <Conversation
              onClickDisplay={handleAddContact}
              messages={messages}
              activeMessageGroup={activeMessageConversation}
            />
          ) : (
            <MessageSkeletonList />
          )}
        </Paper>
      </Slide>
    </div>
  );
};
