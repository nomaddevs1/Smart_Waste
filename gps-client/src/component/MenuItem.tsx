import { Text } from "@chakra-ui/react";

export const MenuItem = ({ children, ...rest }: { children: any }) => {
  return (
    <Text display="block" {...rest}>
      {children}
    </Text>
  );
};


