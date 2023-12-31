export const getSender = (loggedUser, users) => {
  // console.log(loggedUser);
  // console.log(users);
  if (!loggedUser) {
    return "Unknown Logged User";
  } else if (!users || !users[0] || !users[1]) {
    return "Loading.....";
  }
  return users[0]._id === loggedUser._id ? users[1].name : users[0].name;
};

export const getSenderFull = (loggedUser, users) => {
  if (!loggedUser) {
    return "Unknown Logged User";
  } else if (!users || !users[0] || !users[1]) {
    return "Loading.....";
  }
  return users[0]._id === loggedUser._id ? users[1] : users[0];
};

export const isSameSender = (messages, m, i, userId) => {
  return (
    i < messages.length - 1 &&
    (messages[i + 1].sender._id !== m.sender._id ||
      messages[i + 1].sender._id === undefined) &&
    messages[i].sender._id !== userId
  );
};

export const isLastMessage = (messages, i, userId) => {
  return (
    i === messages.length - 1 &&
    messages[messages.length - 1].sender._id !== userId &&
    messages[messages.length - 1].sender._id
  );
};

export const isSameSenderMargin = (messages, m, i, userId) => {
  if (
    i < messages.length - 1 &&
    messages[i + 1].sender._id === m.sender._id &&
    messages[i].sender._id !== userId
  )
    return 33;
  else if (
    (i < messages.length - 1 &&
      messages[i + 1].sender._id !== m.sender._id &&
      messages[i].sender._id !== userId) ||
    (i === messages.length - 1 && messages[i].sender._id !== userId)
  )
    return 0;
  else return "auto";
};

export const isSameUser=(messages,m,i)=>{
  return i>0 && messages[i-1].sender._id === m.sender._id;
}

export const checkIfSenderIsUser=(user,latestMessage)=>{
  // console.log("ChatLogic-------")
  // console.log(user._id);
  // console.log(latestMessage._id)
  // console.log("Object----")
  // console.log(latestMessage)
  if(latestMessage._id === user._id){
    return "You";
  }

  return latestMessage.name.split(" ")[0];
}