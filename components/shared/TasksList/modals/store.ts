import { ModalsController } from '../../../../helpers/ModalsController';
import { TaskDeleteModal } from './TaskDeleteModal';
import { TaskGoalAssignModal } from './TaskGoalAssignModal';
import { GoalCreationModal } from '../../../pages/Goals/modals/GoalCreationModal';
import { TasksListStore } from '../store';
import { GoalData } from '../../../pages/Goals/types';
import { DescriptionData } from '../../../../types/description';
import { TaskWontDoModal } from './TaskWontDoModal';

export enum ModalsTypes {
  DELETE_TASK,
  WONT_DO_TASK,
  GOAL_ASSIGN,
  GOAL_CREATION,
}

export class TasksModals {
  constructor(public parent: TasksListStore) {}

  controller = new ModalsController({
    [ModalsTypes.DELETE_TASK]: TaskDeleteModal,
    [ModalsTypes.WONT_DO_TASK]: TaskWontDoModal,
    [ModalsTypes.GOAL_ASSIGN]: TaskGoalAssignModal,
    [ModalsTypes.GOAL_CREATION]: GoalCreationModal,
  });

  openVerifyDeleteModal = (ids: string[], done?: () => void) => {
    this.controller.open({
      type: ModalsTypes.DELETE_TASK,
      props: {
        onDelete: () => {
          this.parent.deleteTasks(ids);
          this.controller.close();
          done?.();
        },
        onClose: this.controller.close,
      },
    });
  };

  openWontDoModal = (ids: string[], done?: () => void) => {
    this.controller.open({
      type: ModalsTypes.WONT_DO_TASK,
      props: {
        onSave: (reason: string) => {
          this.parent.setTaskWontDoReason(ids, reason);
          this.controller.close();
          done?.();
        },
        onClose: this.controller.close,
      },
    });
  };

  openGoalCreationModal = (cb?: (goalId?: string) => void) => {
    this.controller.open({
      type: ModalsTypes.GOAL_CREATION,
      props: {
        onClose: () => {
          this.controller.close();

          if (cb) {
            cb();
          }
        },
        onSave: (goal: GoalData, description?: DescriptionData) => {
          this.parent.root.resources.goals.add(goal, description);
          this.controller.close();

          if (cb) {
            cb(goal.id);
          }
        },
      },
    });
  };

  openGoalAssignModal = (taskId?: string, startGoalId?: string) => {
    const focused = this.parent.draggableList.focused;
    const value =
      startGoalId ||
      (taskId
        ? this.parent.items[taskId].goalId
        : this.parent.draggableList.focused.length === 1
        ? this.parent.items[this.parent.draggableList.focused[0]].goalId
        : null);

    this.controller.open({
      type: ModalsTypes.GOAL_ASSIGN,
      props: {
        callbacks: {
          onClose: this.controller.close,
          onGoalCreateClick: () => {
            this.openGoalCreationModal((goalId: string) => {
              this.openGoalAssignModal(taskId, goalId);
            });
          },
          onSelect: (goalId: string) => {
            if (taskId) {
              this.parent.assignGoal([taskId], goalId);
            } else {
              this.parent.assignGoal(focused, goalId);
            }
            this.controller.close();
          },
        },
        value,
      },
    });
  };
}
