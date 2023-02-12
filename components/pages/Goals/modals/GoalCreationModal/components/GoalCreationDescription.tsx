import { observer } from 'mobx-react-lite';
import { Box, Center, CircularProgress, Input, Stack } from '@chakra-ui/react';
import { useGoalCreationModalStore } from '../store';
import { Editor } from '../../../../../shared/Editor';
import { GoalCreationEmojiSelect } from './GoalCreationEmojiSelect';
import React from "react";

export const GoalCreationDescription = observer(
  function GoalCreationDescription() {
    const store = useGoalCreationModalStore();

    return (
      <Box
        overflow='visible'
        position='absolute'
        left={0}
        right={0}
        top={0}
        bottom={0}
        display='flex'
        alignItems='center'
        flexDirection='column'
        m='auto'
      >
        <Stack
          flexDirection='row'
          maxW='3xl'
          width='100%'
          alignItems='center'
          ml={6}
          mr={6}
        >
          <GoalCreationEmojiSelect />
          <Input
            size='lg'
            value={store.title}
            autoFocus
            placeholder='Goal Name'
            _placeholder={{ color: 'gray.400' }}
            onChange={store.handleTitleChange}
            variant='flushed'
            fontSize='md'
            fontWeight='semibold'
            flex={1}
            height='2rem'
            _focusVisible={{
              borderColor: 'blue.400',
              boxShadow: 'none',
            }}
          />
        </Stack>
        <Box mt={4} width='100%' flex={1}>
          {store.isDescriptionLoading ? (
            <Center>
              <CircularProgress isIndeterminate size='24px' />
            </Center>
          ) : (
            <Editor
              content={
                store.description ? store.description.content : undefined
              }
              contentContainerProps={{
                  maxW: '2xl',
                  margin: 'auto',
              }}
              onUpdate={store.handleDescriptionChange}
              onSave={store.handleSave}
            />
          )}
        </Box>
      </Box>
    );
  }
);
