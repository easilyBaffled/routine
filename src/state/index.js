import { combineReducers, createStore } from "redux";
import produce from "immer";

import initialState from "./initialState";
import { createActions, createReducer } from "./util";
import tasks, {
  actors as taskActors,
  getTime,
  actions as taskItemActions
} from "./task";
import tags, {
  hasPending,
  hasRecurring,
  hasStreak,
  isRecurring,
  isStreak,
  isInfectious,
  removeTag,
  status,
  isInfectedBy,
  hasInfectious,
  hasInfectedBy,
  hasDone,
  hasActive,
  createTag
} from "./tags";
import { collectionOf } from "./collection";

export const isDaysAgo = (date = new Date(), range) => {
  const currentDate = new Date(); // isTestEnv ? debugDate() : Date.now();
  currentDate.setDate(currentDate.getDate() - range);
  return date.getDate() < currentDate.getDate();
};

const resolveOldTasks = (t) => {
  if (isDaysAgo(new Date(t.createdAt), 5)) {
    t.tags.unshift(tags.infectious());
  }
};

const resolveStreakTask = (t, state) => {
  const { streak } = t.tags.find(isStreak);
  const index = streak.findIndex((v) => !v);
  streak[index] = Date.now(); // isTestEnv ? debugDate() : Date.now();
  t.value = index + 1;
  state.bank += index + 1;

  t.tags = removeTag(t, status.pending);
  t.tags.push(index === streak.length - 1 ? status.done : status.active);
  // How to loop streaks
};

const cycleStatusTag = (task) => {
  task.tags = removeTag(task, status.pending);
  task.tags.push(status.done);
};

const taskCollection = collectionOf(
  tasks,
  taskActors,
  initialState.tasks,
  "tasks"
);

const reducers = combineReducers(
  Object.entries(initialState).reduce(
    (acc, [k, v]) => (k in acc ? acc : ((acc[k] = createReducer({}, v)), acc)),
    {
      tasks: taskCollection.collectionReducer
    }
  )
);

export const taskActions = {
  ...taskCollection.collectionActions,
  ...taskItemActions
};

export const actors = {
  createTask: (s) => ({
    ...s,
    totalTime: s.tasks.reduce((acc, task) => acc + getTime(task), 0)
  }),
  setTaskList: (s, tasks) => (
    console.log(tasks, s),
    {
      ...s,
      tasks
    }
  ),
  resolveDay: (s) => ({
    ...s,
    tasks: initialState.tasks
  }),
  _resolveDay: (s) =>
    console.tap(
      produce(s, (state) =>
        console.tap(state, "produce").tasks.forEach((t) => {
          if (!hasInfectious(t)) {
            // When a task is first infected it should still trigger infection, which is why it's not paired in an if/else
            resolveOldTasks(t);
          }
          if (hasInfectious(t) && !hasPending(t)) {
            const pickedTask = state.tasks.find(
              (subject) =>
                subject.id !== t.id &&
                !hasInfectedBy(subject) &&
                !hasInfectious(subject)
            );
            if (pickedTask) {
              t.value += pickedTask.value;
              pickedTask.tags.unshift(tags.infectedBy(t.id, pickedTask.value));
              pickedTask.value = null;

              t.tags.find(isInfectious).infected.push(pickedTask.id);
            }
          }
          if (hasPending(t)) {
            if (hasInfectious(t)) {
              t.tags.find(isInfectious).infected.forEach((id) => {
                const task = state.tasks.find((task) => task.id === id);
                if (hasActive(task)) {
                  const infection = task.tags.find(isInfectedBy);
                  task.value = infection.value;
                  task.tags = removeTag(task, tags.infectedBy());
                }
              });
            }
            if (hasStreak(t) || hasRecurring(t)) {
              if (hasStreak(t)) {
                resolveStreakTask(t, state); // I will have a conflict with infected tasks, as it doesn't read from value
              }
              if (hasRecurring(t)) {
                t.tags = removeTag(t, status.pending);
                t.tags.push(status.active);

                t.tags.find(isRecurring).done.push(Date.now());
                // .done.push(isTestEnv ? debugDate() : Date.now());

                state.bank += t.value;
              }
            } else {
              cycleStatusTag(t);
              if (t.value) {
                state.bank += t.value;
              }
            }
          }
        })
      ),
      "resolved"
    ),
  _fullReset: () => initialState
};

export const actions = createActions(actors);

const saveState = (s) => (localStorage.setItem("state", JSON.stringify(s)), s);
const loadState = () => JSON.parse(localStorage.getItem("state") ?? "null");

/*
 * Standard reducers are isolated from one another. They cannot share values.
 * The Director is the only reducer with access to all of state.
 * This way it can validate and update values that have cross state dependencies
 *
 * @param {Object} state
 * @param {{payload: *, type: string}} action
 * @return {Object}
 */
const appReducer = (state = loadState() || initialState, action = {}) =>
  saveState(
    createReducer(actors, loadState() || initialState)(
      reducers(state, action),
      action
    )
  );

export default createStore(appReducer);
