import React, { useRef } from 'react';
import { observer } from 'mobx-react-lite';
import {
  Box,
  Center,
  Checkbox,
  CircularProgress,
  Container,
  Divider,
  HStack,
  Text,
  useOutsideClick,
} from '@chakra-ui/react';
import { useTaskStore } from './store';
import { ItemToolbar } from '../ItemToolbar/itemToolbar';
import { OriginIcon } from '../../pages/Spaces/components/SpacesIcons/OriginsIcons';
import { TaskQuickEditorStoreProvider } from '../TasksList/components/TaskQuickEditor/store';
import { TaskQuickEditorInput } from '../TasksList/components/TaskQuickEditor/TaskQuickEditorInput';
import { TaskQuickEditorTags } from '../TasksList/components/TaskQuickEditor/TaskQuickEditorTags';
import { TaskStatus } from '../TasksList/types';
import { TaskModesMenu } from './TaskModesMenu';
import { TaskEditor } from './TaskEditor';

export const TaskView = observer(function TaskView() {
  const store = useTaskStore();
  const ref = useRef();

  useOutsideClick({
    ref,
    handler: store.quickEditor.handleClickOutside,
  });

  return (
    <Container
      tabIndex={0}
      onMouseDown={store.callbacks.onFocus}
      onKeyDown={store.handleContainerKeyDown}
      h='100%'
      maxW='container.md'
      p={6}
      display='flex'
      flexDirection='column'
      justifyContent='space-between'
      _focus={{
        outline: 'none',
      }}
    >
      <TaskQuickEditorStoreProvider
        instance={store.quickEditor}
        callbacks={store.quickEditorCallbacks}
        spaces={store.spaces}
        goals={store.goals}
        order={store.modesOrder}
        tagsMap={store.tagsMap}
        task={store.data}
      >
        <Box minH={0} flex={1} pb={6} display='flex' flexDirection='column'>
          <ItemToolbar
            onPreviousItem={store.handlePreviousItem}
            onNextItem={store.handleNextItem}
            onClose={store.handleClose}
            onExpand={store.handleExpand}
            onCollapse={store.handleCollapse}
            hasPreviousItem={store.hasPrevious}
            hasNextItem={store.hasNext}
            isExpanded={store.isExpanded}
          />
          <Box mt={6}>
            <TaskModesMenu />
            <Box
              transition='opacity 0.2s ease-in-out'
              opacity={
                store.isWontDo &&
                !store.isEditorFocused &&
                !store.quickEditor.isInputFocused
                  ? 0.5
                  : 1
              }
            >
              <HStack ref={ref} alignItems='start'>
                <Box h={9} display='flex' alignItems='center'>
                  <Checkbox
                    variant='indeterminateUnfilled'
                    bg='white'
                    size='lg'
                    cursor='pointer'
                    isChecked={store.data.status === TaskStatus.DONE}
                    isIndeterminate={store.data.status === TaskStatus.WONT_DO}
                    onChange={store.handleStatusChange}
                    name='task-status'
                  />
                </Box>
                <TaskQuickEditorInput
                  fontSize='2xl'
                  fontWeight='semibold'
                  multiline
                />
              </HStack>
              <Box mt={4} id='editor' overflow='auto'>
                {store.isDescriptionLoading ? (
                  <Center>
                    <CircularProgress isIndeterminate size='24px' />
                  </Center>
                ) : (
                  <TaskEditor />
                )}
              </Box>
            </Box>
          </Box>
          {store.isWontDo && store.data.wontDoReason && (
            <Box>
              <Divider mt={8} mb={6} />
              <Text fontSize='md' fontWeight='semibold'>
                Why you weren&apos;t able to manage this task?
              </Text>
              <Text fontSize='sm' fontWeight='normal' mt={2}>
                {store.data.wontDoReason}
              </Text>
            </Box>
          )}
        </Box>
        {store.data.input && store.inputSpace ? (
          <Box>
            <Divider />
            <Box
              borderColor='gray.200'
              display='flex'
              alignItems='center'
              pt={2}
              pb={2}
            >
              <OriginIcon origin={store.data.input.origin.type} />
              <Text fontSize='xs' fontWeight='normal' ml={1}>
                {store.data.input.title}
              </Text>
            </Box>
            <Divider />
          </Box>
        ) : null}
        <TaskQuickEditorTags
          boxProps={{
            display: 'inline',
          }}
          buttonProps={{
            mt: 2,
          }}
        />
      </TaskQuickEditorStoreProvider>
    </Container>
  );
});
