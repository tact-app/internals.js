import { observer } from 'mobx-react-lite';
import {
  Button,
  chakra,
  Divider,
  Fade,
  forwardRef,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Portal,
  useDisclosure,
} from '@chakra-ui/react';
import { TaskItemMenuIcon } from '../../../Icons/TaskItemMenuIcon';
import { TaskItemStore, useTaskItemStore } from '../TaskItem/store';
import React, {
  PropsWithChildren,
  useCallback,
  useMemo,
  useState,
} from 'react';
import { TaskStatus } from '../../types';
import { Modes } from '../TaskQuickEditor/store';
import { useListNavigation } from '../../../../../helpers/ListNavigation';
import { useHotkeysHandler } from '../../../../../helpers/useHotkeysHandler';

const multiTaskItems = (store: TaskItemStore) => [
  {
    onClick: () => {
      store.parent.modals.openGoalAssignModal();
    },
    command: '⌥G',
    hotkey: 'g',
    title: 'Assign to goal',
  },
  null,
  {
    onClick: () =>
      store.parent.setTasksStatus(
        store.parent.draggableList.focused,
        TaskStatus.DONE
      ),
    title: store.parent.canUnsetStatus(TaskStatus.DONE)
      ? 'Unmark as done'
      : 'Mark as done',
    hotkey: 'd',
    command: '⌥D',
  },
  {
    onClick: () =>
      store.parent.setTasksStatus(
        store.parent.draggableList.focused,
        TaskStatus.WONT_DO
      ),
    title: store.parent.canUnsetStatus(TaskStatus.WONT_DO)
      ? 'Unmark as won’t do'
      : 'Mark as won’t do',
    hotkey: ['w', 'shift+w'],
    command: '⌥W / ⌥⇧W',
  },
  null,
  {
    onClick: () => store.parent.sendTasks(store.parent.draggableList.focused),
    title: 'Move to ' + store.parent.tasksReceiverName,
    hotkey: 'm',
    command: '⌥M',
  },
  {
    onClick: () =>
      store.parent.deleteWithVerify(store.parent.draggableList.focused),
    title: 'Delete tasks',
    hotkey: ['backspace', 'meta+backspace', 'ctrl+backspace'],
    command: '⌫ / ⌘⌫',
  },
];

const singleTaskItems = (store: TaskItemStore) => [
  {
    onClick: () => {
      store.parent.setEditingTask(store.task.id);
      setTimeout(() => store.quickEdit.activateMode(Modes.PRIORITY));
    },
    title: 'Change priority',
  },
  {
    onClick: () => {
      store.parent.setEditingTask(store.task.id);
      setTimeout(() => store.quickEdit.activateMode(Modes.TAG));
    },
    title: 'Add tag',
  },
  {
    onClick: () => {
      store.parent.modals.openGoalAssignModal(store.task.id);
    },
    command: '⌥G',
    hotkey: 'g',
    title: 'Assign to goal',
  },
  null,
  {
    onClick: () =>
      store.parent.handleStatusChange(store.task.id, TaskStatus.DONE),
    title: store.parent.canUnsetStatus(TaskStatus.DONE)
      ? 'Unmark as done'
      : 'Mark as done',
    hotkey: 'd',
    command: '⌥D',
  },
  {
    onClick: () =>
      store.parent.handleStatusChange(store.task.id, TaskStatus.WONT_DO),
    title: store.parent.canUnsetStatus(TaskStatus.WONT_DO)
      ? 'Unmark as won’t do'
      : 'Mark as won’t do',
    hotkey: ['w', 'shift+w'],
    command: store.parent.canUnsetStatus(TaskStatus.WONT_DO)
      ? '⌥W'
      : '⌥W / ⌥⇧W',
  },
  null,
  {
    onClick: () => store.parent.sendTasks([store.task.id]),
    title: 'Move to ' + store.parent.tasksReceiverName,
    hotkey: 'm',
    command: '⌥M',
  },
  {
    onClick: () => {
      store.parent.openTask(store.task.id, true);

      if (!store.isFocused) {
        store.parent.draggableList.setFocusedItem(store.task.id);
      }
    },
    title: 'Open task',
    command: '↵',
  },
  {
    onClick: () => {
      store.parent.setEditingTask(store.task.id);

      if (!store.isFocused) {
        store.parent.draggableList.setFocusedItem(store.task.id);
      }
    },
    title: 'Edit task',
    hotkey: 'space',
    command: '␣',
  },
  {
    onClick: () => store.parent.deleteWithVerify([store.task.id]),
    title: 'Delete task',
    hotkey: ['backspace', 'meta+backspace', 'ctrl+backspace'],
    command: '⌫ / ⌘⌫',
  },
];

const TaskItemMenuItem = forwardRef(
  (
    {
      onClick,
      command,
      children,
    }: PropsWithChildren<{
      onClick: () => void;
      command?: string;
    }>,
    ref
  ) => {
    const store = useTaskItemStore();
    const handleClick = useCallback(() => {
      store.closeMenu();
      onClick();
    }, [store, onClick]);

    return (
      <Button
        ref={ref}
        onClick={handleClick}
        display='flex'
        justifyContent='space-between'
        variant='unstyled'
        borderRadius='none'
        _hover={{ bg: 'gray.100' }}
        _focus={{ outline: 'none', bg: 'gray.100', boxShadow: 'none' }}
        w='100%'
        pr={2}
        pl={2}
      >
        <chakra.span fontWeight='normal'>{children}</chakra.span>
        <chakra.span color='gray.400' fontWeight='normal'>
          {command}
        </chakra.span>
      </Button>
    );
  }
);

const TaskItemMenuItems = ({
  items,
  refs,
}: {
  refs: (index: number, el: HTMLButtonElement) => void;
  items: {
    onClick: () => void;
    command?: string;
    title: string;
  }[];
}) => {
  return (
    <>
      {items.map((item, index) =>
        item === null ? (
          <Divider key={index} />
        ) : (
          <TaskItemMenuItem
            ref={(el) => refs(index, el)}
            key={item.title}
            onClick={item.onClick}
            command={item.command}
          >
            {item.title}
          </TaskItemMenuItem>
        )
      )}
    </>
  );
};

const TaskItemMenuContent = observer(function TaskItemMenuContent({
  isOpen,
  stopAnimation,
}: {
  isOpen: boolean;
  stopAnimation: () => void;
}) {
  const store = useTaskItemStore();

  const ref = useListNavigation(store.menuNavigation);
  const items = store.isMultiSelected
    ? multiTaskItems(store)
    : singleTaskItems(store);

  const { keyMap, hotkeyHandlers } = useMemo(() => {
    const keyMap = {};
    const hotkeyHandlers = {};

    items.forEach((item, index) => {
      if (item && item.hotkey) {
        keyMap[index] = item.hotkey;
        hotkeyHandlers[index] = () => {
          store.closeMenu();
          item.onClick();
        };
      }
    });

    return { keyMap, hotkeyHandlers };
  }, [items, store]);

  useHotkeysHandler(keyMap, hotkeyHandlers);

  return (
    <Portal>
      <Fade in={isOpen} unmountOnExit onAnimationComplete={stopAnimation}>
        <PopoverContent
          tabIndex={-1}
          p={0}
          shadow='lg'
          overflow='hidden'
          w='auto'
          minW={64}
          ref={ref}
          onFocus={store.menuNavigation.handleFocus}
        >
          <PopoverBody p={0}>
            <TaskItemMenuItems
              refs={store.menuNavigation.setRefs}
              items={items}
            />
          </PopoverBody>
        </PopoverContent>
      </Fade>
    </Portal>
  );
});

export const TaskItemMenu = observer(function TaskItemMenu() {
  const store = useTaskItemStore();
  const { isOpen, onClose, onOpen } = useDisclosure({
    isOpen: store.isMenuOpen,
  });
  const [isAnimationInProcess, setIsAnimationInProcess] = useState(false);

  const stopAnimation = useCallback(() => {
    setIsAnimationInProcess(false);
  }, [setIsAnimationInProcess]);

  const close = useCallback(() => {
    setIsAnimationInProcess(true);
    onClose();
    store.closeMenu();
  }, [onClose, store]);

  const open = useCallback(() => {
    setIsAnimationInProcess(true);
    onOpen();
    store.openMenu();
  }, [onOpen, store]);

  return (
    <Popover
      isLazy
      isOpen={isOpen || isAnimationInProcess}
      onOpen={open}
      onClose={close}
      placement={'bottom-start'}
    >
      <PopoverTrigger>
        <Button
          size='xs'
          h='auto'
          minW={5}
          w={5}
          p={0}
          variant='unstyled'
          borderRadius='none'
          _groupHover={{
            visibility: 'visible',
          }}
          _before={{
            content: '""',
            h: '1px',
            left: 0,
            bg: 'transparent',
            transitionProperty: 'background-color',
            transitionDuration: 'normal',
            position: 'absolute',
            top: '-1px',
            w: '100%',
          }}
          _hover={{
            bg: 'gray.100',
            '&:before': {
              bg: 'gray.100',
            },
          }}
          _focus={{
            bg: 'gray.100',
            boxShadow: 'none',
            '&:before': {
              bg: 'gray.100',
            },
          }}
          visibility={store.isDragging ? 'visible' : 'hidden'}
        >
          <TaskItemMenuIcon />
        </Button>
      </PopoverTrigger>
      {(isOpen || isAnimationInProcess) && (
        <TaskItemMenuContent isOpen={isOpen} stopAnimation={stopAnimation} />
      )}
    </Popover>
  );
});
