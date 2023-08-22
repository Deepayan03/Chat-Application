export const getSender = (loggedUser, users) => {
  // console.log("LoggedUser----"+loggedUser)

  // console.log(users);

  if (!loggedUser ) {
    return "Unknown Logged User";
    
  }
  else if(!users || !users[0] || !users[1]){
    return "Loading....."
  }
  // const sender = users[0]._id === loggedUser._id ? users[1].name : users[0].name;
  // setVersion(version => version + 1);
  return users[0]._id === loggedUser._id? users[1].name : users[0].name;
};