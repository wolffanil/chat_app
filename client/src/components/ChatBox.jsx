import { Box } from "@chakra-ui/layout";
import SingleChat from "./SingleChat";
import { useChat } from "../context/ChatContext";

const Chatbox = ({ fetchAgain, setFetchAgain }) => {
  const { selectedChat } = useChat();

  return (
    <Box
      d={{ base: selectedChat ? "flex" : "none", md: "flex" }}
      alignItems="center"
      flexDir="column"
      p={3}
      bg="white"
      w={{ base: "100%", md: "68%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </Box>
  );
};

export default Chatbox;
