import { Box } from "@chakra-ui/layout";
import { useState } from "react";
import { useChat } from "../context/ChatContext";
import SideDrawe from "../components/miscellaneous/SideDrawe";
import MyChats from "../components/MyChats";
import Chatbox from "../components/ChatBox";

const Chatpage = () => {
  const [fetchAgain, setFetchAgain] = useState(false);
  const { user } = useChat();

  return (
    <div style={{ width: "100%" }}>
      {user && <SideDrawe />}
      <Box
        display="flex"
        justifyContent="space-between"
        w="100%"
        h="91.5vh"
        p="10px"
      >
        {user && <MyChats fetchAgain={fetchAgain} />}
        {user && (
          <Chatbox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
      </Box>
    </div>
  );
};

export default Chatpage;
