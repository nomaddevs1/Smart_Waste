import {
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardFooter,
  Divider,
  Heading,
  Image,
  SimpleGrid,
  Stack,
  Text,
} from "@chakra-ui/react";
import { DocumentData } from "firebase/firestore";

const Cards = ({ boards }: { boards: DocumentData[] | [] }) => {

  return (
    <SimpleGrid
      spacing={4}
      templateColumns="repeat(auto-fill, minmax(200px, 1fr))"
      margin={2}
    >
      {boards.map((board, i) => (
        <Card maxW="sm" key={i}>
          <CardBody>
            <Image
              src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
              alt="Green double couch with wooden legs"
              borderRadius="lg"
            />
            <Stack mt="6" spacing="3">
              <Heading size="md">Smart Waste 1</Heading>
              <Text>
                          Lorem ipsum dolor sit amet consectetur adipisicing elit. Sint amet odit omnis qui necessitatibus non sequi at numquam, ipsum voluptatem quia dignissimos obcaecati assumenda molestias doloremque magni illum dolorem! Architecto.                         
              </Text>
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
    </SimpleGrid>
  );
};

export default Cards;
