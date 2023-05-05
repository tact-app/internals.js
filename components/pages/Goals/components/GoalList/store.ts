import { makeAutoObservable, toJS } from 'mobx';
import { RootStore } from '../../../../../stores/RootStore';
import { getProvider } from '../../../../../helpers/StoreProvider';
import { GoalDataExtended, GoalStatus } from "../../types";
import { GoalListCallbacks, GoalListProps } from './types';
import { EDITABLE_TITLE_ID_SLUG } from "../../../../shared/EditableTitle";
import { SpaceData } from "../../../Spaces/types";
import { KeyboardEvent } from 'react';
import { chunk } from 'lodash';

export class GoalListStore {
  listBySpaces: Record<string, GoalDataExtended[]> = {};
  isHotkeysDisabled: boolean;
  callbacks: GoalListCallbacks;

  containerRef: HTMLDivElement | null = null;
  goalsRefs: Record<string, HTMLDivElement> = {};
  focusedGoalId: string | null = null;
  isFocusedGoalEditing: boolean = false;
  isMenuOpenedForFocusedGoal: boolean = false;
  isMenuOpenByContextMenu: boolean = false;
  xPosContextMenu: number;

  keyMap = {
    ON_RESET_FOCUSED_GOAL: ['tab', 'shift+tab'],
    ON_NAVIGATE: ['up', 'down', 'left', 'right'],
    START_GOAL_EDITING: ['space'],
    ON_OPEN: ['enter', 'alt+o'],
    ON_DONE: ['alt+d'],
    ON_WONT_DO: ['alt+w'],
    ON_CLONE: ['alt+c'],
    ON_ARCHIVE: ['alt+a'],
    ON_DELETE: ['backspace', 'alt+backspace'],
    OPEN_GOAL_MENU: ['alt'],
  };

  hotkeyHandlers = {
    ON_RESET_FOCUSED_GOAL: () => {
      this.setFocusedGoalId(null);
    },
    ON_NAVIGATE: (event: KeyboardEvent) => {
      if (!this.focusedGoalId) {
        this.setFirstGoalAsFocused();
      } else if (!this.isFocusedGoalEditing) {
        const currentRowIndex = this.arrayByColumns
          .findIndex((row) => row.includes(this.focusedGoalId));
        const currentColumnIndex = this.arrayByColumns[currentRowIndex]
          .findIndex((goalId) => goalId === this.focusedGoalId);

        let nextGoalRowIndex = null;
        let nextGoalColumnIndex = null;

        if (event.key === 'ArrowDown') {
          nextGoalRowIndex = currentRowIndex + 1;
          nextGoalColumnIndex = currentColumnIndex;
        } else if (event.key === 'ArrowUp') {
          nextGoalRowIndex = currentRowIndex - 1;
          nextGoalColumnIndex = currentColumnIndex;
        } else if (event.key === 'ArrowRight') {
          nextGoalRowIndex = currentRowIndex;
          nextGoalColumnIndex = currentColumnIndex + 1;
        } else if (event.key === 'ArrowLeft') {
          nextGoalRowIndex = currentRowIndex;
          nextGoalColumnIndex = currentColumnIndex - 1;
        }

        const nextGoalId = this.arrayByColumns[nextGoalRowIndex]?.[nextGoalColumnIndex];

        if (nextGoalId) {
          this.setFocusedGoalId(nextGoalId);
        }
      }
    },
    START_GOAL_EDITING: () => {
      if (!this.focusedGoalId) {
        return;
      }

      this.isFocusedGoalEditing = true;
      this.getGoalTitleElement(this.focusedGoalId).click();
    },
    ON_OPEN: () => {
      if (this.isGoalFocusedAndNotEditing) {
        this.callbacks?.onOpenGoal(this.focusedGoalId);
      }
    },
    ON_DONE: () => {
      if (this.isGoalFocusedAndNotEditing) {
        this.doneGoal(this.focusedGoal);
      }
    },
    ON_WONT_DO: () => {
      if (this.isGoalFocusedAndNotEditing) {
        this.callbacks?.onWontDo(this.focusedGoal);
      }
    },
    ON_CLONE: () => {
      if (this.isGoalFocusedAndNotEditing) {
        this.callbacks?.onCloneGoal(this.focusedGoal);
      }
    },
    ON_ARCHIVE: () => {
      if (this.isGoalFocusedAndNotEditing) {
        this.archiveGoal(this.focusedGoal);
      }
    },
    ON_DELETE: () => {
      if (this.isGoalFocusedAndNotEditing) {
        this.handleDeleteGoal(this.focusedGoalId);
      }
    },
    OPEN_GOAL_MENU: () => {
      if (this.isGoalFocusedAndNotEditing) {
        this.toggleActionMenuForGoal(this.focusedGoalId, !this.isMenuOpenedForFocusedGoal)
      }
    },
  };

  constructor(public root: RootStore) {
    makeAutoObservable(this);
  }

  get isGoalFocusedAndNotEditing() {
    return this.focusedGoalId && !this.isFocusedGoalEditing;
  }

  get goalsList() {
    return Object.values(this.listBySpaces).flat();
  }

  get hasClone() {
    return Boolean(this.callbacks?.onCloneGoal);
  }

  get focusedGoal() {
    return this.goalsList.find((goal) => goal.id === this.focusedGoalId);
  }

  get goalCardsColumnCount() {
    return Math.floor(this.containerRef?.clientWidth / 330);
  }

  get arrayByColumns() {
    return Object.entries(this.listBySpaces).reduce((acc, [spaceId, goals]) => {
      return [
        ...acc,
        ...chunk(goals.map((goal) => goal.id), this.goalCardsColumnCount),
      ];
    }, [] as string[][]);
  }

  setContainerRef = (ref: HTMLDivElement) => {
    this.containerRef = ref;
  };

  setGoalRef = (goalId: string, ref: HTMLDivElement) => {
    this.goalsRefs[goalId] = ref;
  }

  getGoalTitleElement = (goalId: string) => {
    return this.goalsRefs[goalId].querySelector(
      `#${EDITABLE_TITLE_ID_SLUG}-${goalId}`
    ) as HTMLParagraphElement;
  };

  cloneGoal = async (goal: GoalDataExtended) => {
    if (!this.hasClone) {
      return;
    }

    const clonedGoal = await this.callbacks.onCloneGoal(goal);
    this.getGoalTitleElement(clonedGoal.id).click();
  }

  doneGoal = (goal: GoalDataExtended) => {
    return this.callbacks?.onUpdateGoal({
      ...goal,
      status: goal.status === GoalStatus.DONE ? GoalStatus.TODO : GoalStatus.DONE,
    });
  }

  archiveGoal = (goal: GoalDataExtended) => {
    return this.callbacks?.onUpdateGoal({
      ...goal,
      isArchived: !goal.isArchived
    });
  }

  handleDeleteGoal = async (goalId: string) => {
    if (
        await this.root.confirm({
          title: 'Delete goal',
          type: 'delete',
          content: 'Are you sure you would like to delete this goal?'
        })
    ) {
      await this.callbacks?.onDeleteGoal(goalId);
    }
  }

  getSpace = (spaceId: string) => {
    return toJS(this.root.resources.spaces.getById(spaceId));
  }

  updateSpace = (space: SpaceData) => {
    return this.root.resources.spaces.update(space);
  }

  setFocusedGoalId = (goalId: string | null) => {
    this.focusedGoalId = goalId;
    this.isFocusedGoalEditing = false;
    this.isMenuOpenedForFocusedGoal = false;

    if (goalId) {
      this.goalsRefs[goalId].focus();
    }
  };

  toggleActionMenuForGoal = (goalId: string | null, isOpen: boolean, xPosContextMenu?: number) => {
    this.isMenuOpenedForFocusedGoal = isOpen;

    if (isOpen) {
      this.focusedGoalId = goalId;
      this.isFocusedGoalEditing = false;
    } else if (document.activeElement === document.body) {
      this.focusedGoalId = null;
      this.isFocusedGoalEditing = false;
    }

    if (isOpen && xPosContextMenu) {
      this.isMenuOpenByContextMenu = true;
      this.xPosContextMenu = xPosContextMenu;
    } else {
      this.isMenuOpenByContextMenu = false;
      this.xPosContextMenu = undefined;
    }
  };

  setEditedGoalId = (goalId: string | null) => {
    this.focusedGoalId = goalId;
    this.isFocusedGoalEditing = true;
  };

  setFirstGoalAsFocused = () => {
    this.setFocusedGoalId(this.goalsList[0]?.id ?? null);
  };

  init = () => {
    if (!this.focusedGoalId && Object.keys(this.goalsRefs).length) {
      this.setFirstGoalAsFocused();
    }
  };

  update = ({
    listBySpaces,
    disableHotkeys,
    onUpdateGoal,
    onDeleteGoal,
    onCloneGoal,
    onOpenGoal,
    onWontDo
  }: GoalListProps) => {
    this.listBySpaces = listBySpaces;
    this.isHotkeysDisabled = disableHotkeys;
    this.callbacks = {
      onCloneGoal,
      onDeleteGoal,
      onUpdateGoal,
      onOpenGoal,
      onWontDo,
    };
  };
}

export const {
  StoreProvider: GoalListStoreProvider,
  useStore: useGoalListStore
} = getProvider(GoalListStore);
