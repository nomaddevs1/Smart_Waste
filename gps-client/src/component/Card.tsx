import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Divider,
  Flex,
  Heading,
  Image,
  Stack,
  Text,
  Box,
} from "@chakra-ui/react";
import { DocumentData } from "firebase/firestore";
import { PencilSimpleLine } from "@phosphor-icons/react";

const Cards = ({ boards }: { boards: DocumentData[] | [] }) => {
  
  return (
    <Flex flexWrap={"wrap"} margin={2}>
      {boards.map((board, i) => (
        <Card maxW="sm" key={i} margin={5}>
          <CardBody>
            <Image
              src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
              alt="Green double couch with wooden legs"
              borderRadius="lg"
            />
            <Stack mt="6" spacing="3">
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Heading size="md">Board {i}</Heading>
                <Button justifySelf="end" variant="link"><PencilSimpleLine/></Button>
              </Box>
              <Text>Location: {board.location}</Text>
              <Text>Board Status: {board.status}</Text>
            </Stack>
          </CardBody>
          <Divider />
          <CardFooter>
            <Text>Serial Number: {board.serialNumber}</Text>
          </CardFooter>
        </Card>
      ))}
    </Flex>
  );
};

export default Cards;
