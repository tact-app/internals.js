import { observer } from 'mobx-react-lite';
import { SpacesMenuProps, useSpacesMenuStore } from './store';
import {
  IconButton,
  chakra,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  Text,
  Box,
} from '@chakra-ui/react';
import { ExpandIcon } from '../../../../shared/Icons/ExpandIcon';
import { SpacesMenuOrigin } from './SpacesMenuOrigin';
import { useHotkeysHandler } from '../../../../../helpers/useHotkeysHandler';
import { SpacesMenuAdd } from './SpacesMenuAdd';
import { GearIcon } from '../../../../shared/Icons/GearIcon';

export const SpacesMenuView = observer(function SpacesMenuView(
  props: SpacesMenuProps
) {
  const store = useSpacesMenuStore();
  useHotkeysHandler(store.keyMap, store.hotkeysHandlers, {
    enabled: props.hotkeysEnabled,
  });

  return (
    <Box h='100%' alignItems='start' p={2}>
      <IconButton
        m={2}
        display='flex'
        aria-label='Expand'
        onClick={store.handleExpanderClick}
        variant='unstyled'
        size='xs'
      >
        <chakra.div
          w={6}
          h={6}
          m={0}
          transition='transform 0.2s'
          transform={store.isExpanded ? 'rotate(180deg)' : 'rotate(0)'}
        >
          <ExpandIcon />
        </chakra.div>
      </IconButton>{' '}
      <Accordion
        w='100%'
        onChange={store.handleSpaceChange}
        index={store.isExpanded ? store.currentSpaceIndex : null}
      >
        {store.spaces.map((space, index) => {
          const { id, name, shortName, color, children } = space;

          return (
            <AccordionItem
              key={id}
              border={0}
              w='100%'
              mb={1}
              isFocusable={false}
              unselectable='on'
            >
              <AccordionButton
                onClick={() => store.handleSpaceClick(index)}
                borderRadius='lg'
                overflow='hidden'
                display='flex'
                justifyContent='space-between'
                tabIndex={-1}
                h={10}
                _focus={{ boxShadow: 'none' }}
                bg={
                  store.currentSpaceId === id &&
                  (store.selectedPath.length === 0 || !store.isExpanded
                    ? color + '.100'
                    : store.focusedPath.length === 0
                    ? color + '.75'
                    : 'transparent')
                }
                p={1}
                _hover={{
                  bg: color + '.75',
                }}
              >
                <Box display='flex' alignItems='center'>
                  <chakra.div
                    borderRadius='full'
                    display='flex'
                    justifyContent='center'
                    alignItems='center'
                    w={8}
                    minW={8}
                    h={8}
                    fontWeight={600}
                    bg={color + '.200'}
                    fontSize='lg'
                    color={color + '.500'}
                  >
                    {shortName}
                  </chakra.div>
                  <Text
                    ml={2}
                    whiteSpace='nowrap'
                    fontSize='md'
                    fontWeight='medium'
                    color={color + '.500'}
                  >
                    {name}
                  </Text>
                </Box>
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    store.callbacks.onSpaceSettingsClick?.(space);
                  }}
                  aria-label='space-settings'
                  size='xs'
                  fill={color + '.500'}
                  stroke={color + '.500'}
                  variant='ghost'
                  _hover={{
                    bg: color + '.100',
                  }}
                >
                  <GearIcon />
                </IconButton>
              </AccordionButton>
              <AccordionPanel p={0} pl={4}>
                {children.map((origin) => (
                  <SpacesMenuOrigin
                    key={origin.name}
                    space={id}
                    item={origin}
                  />
                ))}
                {id !== 'all' && (
                  <SpacesMenuAdd
                    onClick={() => undefined}
                    title='Add origin'
                    size='sm'
                  />
                )}
              </AccordionPanel>
            </AccordionItem>
          );
        })}
      </Accordion>
      <SpacesMenuAdd
        onClick={store.callbacks.onSpaceCreationClick}
        title='Add space'
        size='lg'
      />
    </Box>
  );
});
