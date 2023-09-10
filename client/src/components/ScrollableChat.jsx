import React from "react";
import ScrollableFeed from "react-scrollable-feed";
import { isLastMessage, isSameSender, isSameSenderMargin, isSameUser } from "../config/ChatLogic";
import { ChatState } from "../Context/ChatProvider";
import { Avatar, Tooltip } from "@chakra-ui/react";
const ScrollableChat = ({ messages }) => {
  const { loggedUser } = ChatState();
  return (
    <ScrollableFeed style={{display:"flex",height:"100%"}} >
    {messages &&
      messages.map((m, i) => (
        <div style={{ display: "flex", overflow:"hidden" }} key={i}>
          {(isSameSender(messages, m, i, loggedUser._id) ||
            isLastMessage(messages, i, loggedUser._id)) && (
            <Tooltip label={m.sender.name} placement="bottom-start" hasArrow>
              <Avatar
                mt="7px"
                mr={1}
                size="sm"
                cursor="pointer"
                name={m.sender.name}
                src={m.sender.avatar}
              />
              
            </Tooltip>
          )}
          <span
            style={{
              backgroundColor:`${m.sender._id === loggedUser._id? "blue": "lightgreen"}`,
              color:`${m.sender._id === loggedUser._id? "white": "black"}`,
              borderRadius:"20px",
              padding:"5px 15px",
              maxWidth:"75%",
              marginLeft:isSameSenderMargin(messages,m,i,loggedUser._id),
              marginTop:isSameUser(messages,m,i,loggedUser._id),
              marginBottom:"15px",
              
            }}
          >
            {m.content}
          </span>
          </div>
          ))}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
