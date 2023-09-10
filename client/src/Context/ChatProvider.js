import { createContext, useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [refresh, setRefresh] = useState(false);
  const [selectedChat, setSelectedChat] = useState();
  const [chats, setChats] = useState([]);
  const [loggedUser, setLoggedUser] = useState();
  const [notification,setNotification]=useState([]);
  const [userProfile,setUserProfile]=useState();
  const history = useHistory();
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (!userInfo) {
      history.push("/");
    }
    userInfo && setUser(userInfo);
    userInfo && setLoggedUser(userInfo.data);
    userInfo && setUserProfile(userInfo);
    
  }, [history]);
  return (
    <ChatContext.Provider
      value={{
        user,
        setUser,
        selectedChat,
        setSelectedChat,
        chats,
        setChats,
        refresh,
        setRefresh,
        loggedUser,
        setLoggedUser,
        notification,
        setNotification,
        userProfile,
        setUserProfile
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const ChatState = () => {
  return useContext(ChatContext);
};

export default ChatProvider;
