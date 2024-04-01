import React from 'react';
import { Text, TextProps } from '@chakra-ui/react';
import { Link, LinkProps } from 'react-router-dom';

// Extend the props to include LinkProps when 'to' is provided
interface MenuItemProps extends TextProps {
  children: React.ReactNode;
  to?: LinkProps['to'];
}

export const MenuItem = ({ children, to, ...rest }: MenuItemProps) => {
  if (to) {
    return (
      <Link to={to}>
        <Text as="a" display="block" {...rest}>
          {children}
        </Text>
      </Link>
    );
  }

  return (
    <Text display="block" {...rest}>
      {children}
    </Text>
  );
};
