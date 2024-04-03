import {
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardFooter,
  Divider,
  Flex,
  Heading,
  Image,
  Stack,
  Text,
} from "@chakra-ui/react";
import { DocumentData } from "firebase/firestore";

const Cards = ({ boards }: { boards: DocumentData[] | [] }) => {

  return (
    <Flex
      flexWrap={"wrap"}
      margin={2}
      
    >
      {boards.map((board, i) => (
        <Card maxW="sm" key={i} margin={5}>
          <CardBody>
            <Image
              src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
              alt="Green double couch with wooden legs"
              borderRadius="lg"
            />
            <Stack mt="6" spacing="3">
              <Heading size="md">Board {i}</Heading>
              <Text>Board Status: {board.Status}</Text>
              <Text>Serial Number: {board.serialNumber}</Text>
              <Text>Location: {board.location}</Text>
            </Stack>
          </CardBody>
          <Divider />
          <CardFooter>
            <ButtonGroup spacing="2">
              {board.clientId === "" ? (
                <Button variant="solid" colorScheme="blue">
                  Assign To Client
                </Button>
              ) : (
                <></>
              )}
            </ButtonGroup>
          </CardFooter>
        </Card>
      ))}
    </Flex>
  );
};

export default Cards;
