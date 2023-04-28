import { observer } from 'mobx-react-lite';
import Picker from '@emoji-mart/react';
import {
  Box,
  Button,
  HStack,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Text,
  Portal,
  useOutsideClick,
} from '@chakra-ui/react';
import { useEmojiSelectStore } from './store';
import { EmojiStore } from '../../../stores/EmojiStore';
import { EmojiSelectViewProps } from './types';
import { EMOJI_SELECT_COLORS } from './constants';
import React, { useRef, forwardRef } from "react";
import { useHotkeysHandler } from "../../../helpers/useHotkeysHandler";

export const EmojiSelectComponent = observer(
    forwardRef<HTMLButtonElement, EmojiSelectViewProps>(
        function EmojiSelectComponent(
          {
            size = 8,
            iconFontSize = 'xl',
            borderRadius = 'full',
            canRemoveEmoji,
            cursor,
            tabIndex,
          },
          triggerRef
        ) {
          const store = useEmojiSelectStore();

          const ref = useRef();

          useHotkeysHandler(store.keymap, store.hotkeysHandlers, { enabled: store.isEmojiPickerOpen });
          useOutsideClick({
            ref,
            handler: store.closeEmojiPicker,
            enabled: store.isEmojiPickerOpen,
          });

          const focusedTriggerBoxShadow = `inset 0px 0px 0px 2px var(--chakra-colors-${
              store.mainColor.color
          }-${
              store.mainColor.modifier + 100
          })`;

          return (
              <Popover
                  isOpen={store.isEmojiPickerOpen}
                  onOpen={store.openEmojiPicker}
                  onClose={store.closeEmojiPicker}
                  closeOnEsc={false}
                  isLazy
                  modifiers={[
                    {
                      name: 'preventOverflow',
                      options: {
                        tether: false,
                        altAxis: true,
                        padding: 8,
                        boundary: 'clippingParents',
                        rootBoundary: 'viewport'
                      }
                    }
                  ]}
              >
                <PopoverTrigger>
                  <Button
                      ref={triggerRef}
                      variant='filled'
                      bg={store.color}
                      color={store.mainColor.color + '.500'}
                      borderRadius={borderRadius}
                      boxShadow={store.isEmojiPickerOpen && !store.disabled && focusedTriggerBoxShadow}
                      p={0}
                      w={size}
                      h={size}
                      minW='auto'
                      display='flex'
                      justifyContent='center'
                      alignItems='center'
                      tabIndex={tabIndex}
                      cursor={cursor ?? (store.disabled ? 'default' : 'initial')}
                      _focus={{ boxShadow: !store.disabled && focusedTriggerBoxShadow }}
                      onClick={(e) => !store.disabled && e.stopPropagation()}
                  >
                    <Text fontSize={iconFontSize}>{store.triggerContent}</Text>
                  </Button>
                </PopoverTrigger>
                <Portal>
                  <PopoverContent w='auto' ref={ref} onClick={(e) => e.stopPropagation()}>
                    <PopoverBody p={0}>
                      <Box display='flex' justifyContent='center'>
                        <HStack p={2}>
                          {EMOJI_SELECT_COLORS.map((color) => (
                              <Button
                                  onClick={() => store.handleColorSelect(color)}
                                  key={color}
                                  borderColor={
                                    color === store.color
                                        ? `${store.mainColor.color}.400`
                                        : 'transparent'
                                  }
                                  borderWidth={4}
                                  variant='filled'
                                  bg={color}
                                  borderRadius='full'
                                  size='sm'
                                  p={0}
                              />
                          ))}
                        </HStack>
                      </Box>
                      <Box position='relative'>
                        <Picker
                            autoFocus
                            theme='light'
                            data={EmojiStore.emojiData}
                            onEmojiSelect={store.handleEmojiSelect}
                        />
                        {canRemoveEmoji && store.icon && (
                            <Button
                                right='16px'
                                bottom='20px'
                                position='absolute'
                                size='xs'
                                colorScheme='gray'
                                onClick={store.handleEmojiRemove}
                                zIndex='2'
                            >
                              Remove
                            </Button>
                        )}
                      </Box>
                    </PopoverBody>
                  </PopoverContent>
                </Portal>
              </Popover>
          );
        }
    )
);
