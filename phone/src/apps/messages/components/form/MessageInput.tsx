import React, { FormEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Paper, Box, makeStyles, Button } from '@material-ui/core';
import SendIcon from '@material-ui/icons/Send';
import ImageIcon from '@material-ui/icons/Image';
import { useNuiRequest } from 'fivem-nui-react-lib';
import { MessageEvents } from '../../../../../../typings/messages';
import { TextField } from '../../../../ui/components/Input';
import { fetchNui } from '../../../../utils/fetchNui';
import { useSnackbar } from '../../../../ui/hooks/useSnackbar';

interface IProps {
  onAddImageClick(): void;
  messageConversationId: string | undefined;
  messageGroupName: string | undefined;
}

const useStyles = makeStyles({
  root: { width: '100%' },
});

const MessageInput = ({ messageConversationId, onAddImageClick }: IProps) => {
  const { t } = useTranslation();
  const { addAlert } = useSnackbar();
  const classes = useStyles();
  const [message, setMessage] = useState('');

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (message.trim()) {
      fetchNui(MessageEvents.SEND_MESSAGE, { conversationId: messageConversationId, message }).then(
        (resp) => {
          if (resp !== 'ok') {
            setMessage('');

            return addAlert({
              message: t('APPS_MESSAGES_NEW_MESSAGE_FAILED'),
              type: 'error',
            });
          }

          setMessage('');
        },
      );
    }
  };

  if (!messageConversationId) return null;

  return (
    <Paper variant="outlined" className={classes.root}>
      <form onSubmit={handleSubmit}>
        <Box display="flex">
          <Box pl={1} flexGrow={1}>
            <TextField
              multiline
              aria-multiline="true"
              fullWidth
              inputProps={{ style: { fontSize: '1.3em' } }}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={t('APPS_MESSAGES_NEW_MESSAGE')}
            />
          </Box>
          <Box>
            <Button onClick={onAddImageClick}>
              <ImageIcon />
            </Button>
            <Button type="submit">
              <SendIcon />
            </Button>
          </Box>
        </Box>
      </form>
    </Paper>
  );
};

export default MessageInput;
