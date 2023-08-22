export const getSender = (loggedUser, users) => {
  if (!loggedUser ) {
    return "Unknown Logged User";
    
  }
  else if(!users || !users[0] || !users[1]){
    return "Loading....."
  }
  return users[0]._id === loggedUser._id? users[1].name : users[0].name;
};