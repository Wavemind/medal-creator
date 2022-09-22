/**
 * The external imports
 */
import React from 'react'
import { Box, List, ListItem, Text, useTheme } from '@chakra-ui/react'

/**
 * The internal imports
 */
import { SearchIcon } from '../../assets/icons'

const Popover = ({ results, setSearch }) => {
  const { colors } = useTheme()

  return (
    <Box
      position="absolute"
      top="100%"
      width="100%"
      border="1px solid"
      borderColor={colors.sidebar}
      zIndex={10}
      bg={colors.white}
      borderRadius="md"
      mt={1}
    >
      <List overflow="auto" maxHeight="300">
        {results.map(result => (
          <ListItem
            key={`autocomplete_item_${result.name}`}
            as="li"
            p={3}
            display="flex"
            alignItems="center"
            justifyContent="flex-start"
            cursor="default"
            _hover={{
              backgroundColor: colors.sidebar,
            }}
            onClick={() => setSearch({ term: result.name, selected: true })}
          >
            <SearchIcon />
            <Text ml={3}>{result.name}</Text>
          </ListItem>
        ))}
      </List>
    </Box>
  )
}

export default Popover
