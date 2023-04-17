import React from 'react';
import { observer } from 'mobx-react-lite';
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/modal';
import { Button, Text } from '@chakra-ui/react';
import { useTaskSpaceChangeModalStore } from './store';
import { SpacesSelection } from '../../../SpacesSelection';
import { useListNavigation } from '../../../../../helpers/ListNavigation';
import { useHotkeysHandler } from '../../../../../helpers/useHotkeysHandler';

export const TaskSpaceChangeModalView = observer(
  function TaskSpaceChangeModalView() {
    const store = useTaskSpaceChangeModalStore();

    useListNavigation(store.navigation);
    useHotkeysHandler(store.keyMap, store.hotkeyHandlers)

    return (
      <Modal isCentered isOpen={true} onClose={store.callbacks.onClose}>
        <ModalOverlay />
        <ModalContent
          onFocus={store.navigation.handleFocus}
        >
          <ModalHeader>My spaces</ModalHeader>
          <ModalBody
            maxH={80}
            overflow='auto'
            pl={5}
            pr={5}
          >
            <SpacesSelection
              setRefs={store.navigation.setRefs}
              checked={store.selectedSpaceId ? [store.selectedSpaceId] : []}
              callbacks={{
                onSelect: store.handleSelect,
                onSpaceCreateClick: store.callbacks.onSpaceCreateClick,
              }}
            />
          </ModalBody>
          <ModalFooter display='flex' justifyContent='flex-end'>
            <Button
              mr={3}
              onClick={store.callbacks.onClose}
              display='flex'
              flexDirection='row'
              variant='ghost'
              color='blue.400'
              size='sm'
            >
              Cancel
              <Text
                ml={1}
                fontSize='xs'
                color='blue.400'
                fontWeight={400}
              >
                Esc
              </Text>
            </Button>
            <Button
              bg='blue.400'
              color='white'
              onClick={store.handleSubmit}
              display='flex'
              flexDirection='row'
              size='sm'
            >
              Save
              <Text
                ml={1}
                fontSize='xs'
                color='white'
                fontWeight={400}
              >
                ⌘ + Enter
              </Text>
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  }
);
