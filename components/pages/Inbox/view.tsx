import React from 'react';
import { observer } from 'mobx-react-lite';
import Head from 'next/head';
import TaskList from './components/TaskList';
import { TaskDescription } from './components/TaskDescription';

import 'allotment/dist/style.css';
import { useTasksStore } from './store';
import { useHotkeysHandler } from '../../../helpers/useHotkeysHandler';

export const TasksView = observer(function TasksView() {
  const store = useTasksStore();

  useHotkeysHandler(store.keyMap, store.hotkeyHandlers);

  return (
    <>
      <Head>
        <title>Inbox</title>
      </Head>
      <TaskList />
      {store.openedTask && <TaskDescription task={store.openedTaskData} />}
    </>
  );
});
