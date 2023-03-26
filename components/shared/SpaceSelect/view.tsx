import {
  Button,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Portal,
  chakra,
  ChakraProps,
  useOutsideClick,
} from '@chakra-ui/react';
import React, { useRef } from 'react';
import { observer } from 'mobx-react-lite';
import { useSpaceSelectStore } from './store';
import { SpacesSmallIcon } from "../../pages/Spaces/components/SpacesIcons/SpacesSmallIcon";
import { faCheck, faPlus } from "@fortawesome/pro-regular-svg-icons";
import { faAngleRight } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ModalsSwitcher } from "../../../helpers/ModalsController";
import { Tooltip } from '../Tooltip';
import { SpaceData } from "../../pages/Spaces/types";

export const SUGGESTIONS_MENU_ID = 'task-quick-editor-suggestions';

export const SpaceSelectView = observer(function SpaceSelectView() {
  const store = useSpaceSelectStore();

  const ref = useRef();

  useOutsideClick({
    ref,
    handler: store.handleClickOutside,
  });

  const renderSpace = (space: SpaceData, index: number, itemContainerProps: ChakraProps) => {
    const isSelected = space.id === store.selectedSpaceId;

    return (
      <chakra.div
        {...itemContainerProps}
        key={space.id}
        bg={index === store.hoveredIndex ? 'gray.100' : ''}
        onClick={() => store.handleSuggestionSelect(space.id)}
      >
        <chakra.div display='flex' alignItems='center'>
          <SpacesSmallIcon space={space} size={7} borderRadius={4} bgOpacity='.100' />
          <chakra.span color={isSelected ? 'blue.400' : 'gray.700'} ml={2} mr={2} overflow='hidden' textOverflow='ellipsis'>
            {space.name}
          </chakra.span>
        </chakra.div>

        {isSelected && (
          <chakra.span position='absolute' color='blue.400' top='50%' transform='translate(0, -50%)' right={2.5}>
            <FontAwesomeIcon
              fontSize={14}
              icon={faCheck}
              fixedWidth
            />
          </chakra.span>
        )}
      </chakra.div>
    )
  }

  const renderContent = () => {
    if (!store.spaces.length) {
      return (
        <chakra.span
          display='flex'
          alignItems='center'
          justifyContent="center"
          color='gray.500'
          textAlign='center'
          p={5}
        >
          You haven&apos;t created any space yet
        </chakra.span>
      );
    }

    const itemContainerProps: ChakraProps = {
      pt: 1.5,
      pb: 1.5,
      pr: 5,
      pl: 4,
      w: '100%',
      display: 'flex',
      position: 'relative',
      cursor: 'pointer',
      _hover: { bg: 'gray.100' },
    };

    return [
      ...store.spaces.map((space, index) => renderSpace(space, index, itemContainerProps)),
      <chakra.div
        {...itemContainerProps}
        key='create-space'
        onClick={store.handleCreate}
      >
        <chakra.div display='flex' alignItems='center'>
          <chakra.div
            w={7}
            h={7}
            rounded='full'
            display='flex'
            alignItems='center'
            justifyContent='center'
            bg='blue.400'
            color='white'
          >
            <FontAwesomeIcon icon={faPlus} fontSize={18} />
          </chakra.div>
          <chakra.span ml={2} mr={2}>Create new space</chakra.span>
        </chakra.div>
      </chakra.div>
    ]
  };

  return (
    <chakra.div display='flex' role='group'>
      <Tooltip label='Change space' isDisabled={store.isMenuOpen || store.isCreateModalOpened}>
        <Button
          ref={store.setButtonContainerRef}
          p={.5}
          h='auto'
          bg={store.isMenuOpen ? store.selectedSpace.hoverColor : 'transparent'}
          _focus={{ bg: store.selectedSpace.hoverColor }}
          _focusVisible={{ boxShadow: 'none' }}
          _groupHover={{ bg: store.selectedSpace.hoverColor }}
          onClick={store.toggleMenu}
          onKeyDown={store.handleButtonContainerKeyDown}
          role='group'
        >
          <Popover
            placement='bottom-start'
            isLazy
            autoFocus={false}
            closeOnEsc={false}
            isOpen={store.isMenuOpen}
          >
            <PopoverTrigger>
              <chakra.div display='flex' w='100%' h='100%' alignItems='center'>
                <SpacesSmallIcon space={store.selectedSpace} size={6} borderRadius={4} bgOpacity='.100' />
                <chakra.span ml={1} mr={1.5} fontWeight='normal' fontSize='sm' overflow='hidden' textOverflow='ellipsis'>
                  {store.selectedSpace.name}
                </chakra.span>
              </chakra.div>
            </PopoverTrigger>
            <Portal>
              <PopoverContent
                data-id={SUGGESTIONS_MENU_ID}
                onClick={(e) => e.stopPropagation()}
                p={0}
                boxShadow='lg'
                minW={32}
                maxW={72}
                width='auto'
                overflow='hidden'
                ref={ref}
              >
                <PopoverBody p={0} maxH={64} overflow='auto' ref={store.setMenuRef}>
                  {renderContent()}
                </PopoverBody>
              </PopoverContent>
            </Portal>
          </Popover>

          <ModalsSwitcher controller={store.controller} />
        </Button>
      </Tooltip>

      <Tooltip label='Go to space' hotkey='Press G and then S'>
        <Button
          colorScheme='gray'
          variant='outline'
          ml={2}
          w={7}
          h={7}
          display='flex'
          alignItems='center'
          justifyContent='center'
          p={0}
          minW={0}
          opacity={0}
          color='gray.400'
          _groupHover={{ opacity: 1 }}
          onClick={store.goToSpace}
        >
          <FontAwesomeIcon icon={faAngleRight} fontSize={20} />
        </Button>
      </Tooltip>
    </chakra.div>
  );
});
