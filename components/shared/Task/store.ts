import { RootStore } from '../../../stores/RootStore';
import { makeAutoObservable, reaction, runInAction, toJS } from 'mobx';
import { getProvider } from '../../../helpers/StoreProvider';
import { TaskData } from '../TasksList/types';
import { TaskQuickEditorStore } from '../TasksList/components/TaskQuickEditor/store';
import { DescriptionData } from '../../../types/description';
import { JSONContent } from '@tiptap/core';
import { v4 as uuidv4 } from 'uuid';
import { SpaceData } from '../../pages/Spaces/types';

export type TaskProps = {
  callbacks: {
    onClose?: () => void;
    onBlur?: () => void;
    onCollapse?: () => void;
    onExpand?: () => void;
    onNextItem?: (taskId: string, stay?: boolean) => void;
    onPreviousItem?: (taskId: string, stay?: boolean) => void;
  };
  spaces: SpaceData[];
  isEditorFocused?: boolean;
  task: TaskData;
};

class TaskStore {
  constructor(public root: RootStore) {
    makeAutoObservable(this);
  }

  quickEditor: TaskQuickEditorStore = new TaskQuickEditorStore(this.root);

  isEditorFocused: boolean = false;
  callbacks: TaskProps['callbacks'];
  data: TaskData | null = null;
  spaces: SpaceData[] = [];
  isDescriptionLoading: boolean = true;
  description: DescriptionData | null = null;

  get inputSpace() {
    return this.spaces.find((space) => space.id === this.data?.input.spaceId);
  }

  handleDescriptionChange = (content: JSONContent) => {
    this.description.content = content;
  };

  setDescription = (description?: DescriptionData) => {
    if (description) {
      this.description = description;
    } else {
      this.description = {
        id: uuidv4(),
        content: undefined,
      };

      this.data.descriptionId = this.description.id;
      this.root.api.tasks.update({
        id: this.data.id,
        fields: {
          descriptionId: this.description.id,
        },
      });
      this.root.api.descriptions.add({
        id: this.description.id,
        content: toJS(this.description.content),
      });
    }
  };

  handleDescriptionBlur = () => {
    if (this.description.content) {
      this.callbacks.onBlur?.();
      this.root.api.descriptions.update({
        id: this.description.id,
        fields: {
          content: toJS(this.description.content),
        },
      });
    }
  };

  handleNextItem = () => {
    this.handleDescriptionBlur();
    this.callbacks.onNextItem(this.data?.id, true);
  };

  handlePreviousItem = () => {
    this.handleDescriptionBlur();
    this.callbacks.onPreviousItem(this.data?.id, true);
  };

  handleExpand = () => {
    this.callbacks.onExpand?.();
  };

  handleCollapse = () => {
    this.callbacks.onCollapse?.();
  };

  handleClose = () => {
    this.handleDescriptionBlur();
    this.callbacks.onClose?.();
  };

  loadDescription = async () => {
    this.isDescriptionLoading = true;

    const description = this.data?.descriptionId
      ? await this.root.api.descriptions.get(this.data.descriptionId)
      : null;

    this.setDescription(description);

    runInAction(() => (this.isDescriptionLoading = false));
  };

  subscribe = () =>
    reaction(() => this.data?.id, this.loadDescription, {
      fireImmediately: true,
    });

  update = (props: TaskProps) => {
    this.data = props.task;
    this.spaces = props.spaces;
    this.isEditorFocused = props.isEditorFocused;
    this.callbacks = props.callbacks;
  };
}

export const { useStore: useTaskStore, StoreProvider: TaskStoreProvider } =
  getProvider(TaskStore);
