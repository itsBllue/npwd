import React, { useState } from 'react';
import { Box } from '@mui/material';

import { Message, MessageGroup } from '../../../../../../typings/messages';
import MessageInput from '../form/MessageInput';
import useStyles from './modal.styles';
import { MessageImageModal } from './MessageImageModal';
import { useQueryParams } from '../../../../common/hooks/useQueryParams';
import { MessageBubble } from './MessageBubble';

interface IProps {
  activeMessageGroup: MessageGroup;
  messages: Message[];
  onClickDisplay(phoneNumber: string): void;
}

export const CONVERSATION_ELEMENT_ID = 'message-modal-conversation';

const Conversation = ({ activeMessageGroup, messages, onClickDisplay }: IProps) => {
  const classes = useStyles();
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const query = useQueryParams();
  const referalImage = query?.image || null;

  return (
    <div className={classes.conversationContainer}>
      <MessageImageModal
        image={referalImage}
        onClose={() => setImageModalOpen(false)}
        isOpen={imageModalOpen}
        messageGroupId={activeMessageGroup.groupId}
      />
      <Box
        id={CONVERSATION_ELEMENT_ID}
        height="85%"
        pt={6}
        style={{ flex: 1, display: 'flex', overflowY: 'auto' }}
      >
        <Box
          style={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: 'min-content',
            width: '100%',
          }}
        >
          {messages.map((message) => (
            <MessageBubble
              onClickDisplay={onClickDisplay}
              key={message.id}
              message={message}
              isGroupChat={activeMessageGroup?.isGroupChat}
            />
          ))}
        </Box>
      </Box>
      <MessageInput
        /*  I should do some groupDiplay here */
        messageGroupName={activeMessageGroup.label || activeMessageGroup.groupDisplay}
        messageGroupId={activeMessageGroup.groupId}
        onAddImageClick={() => setImageModalOpen(true)}
      />
    </div>
  );
};

export default Conversation;
