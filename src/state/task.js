import { createActions, createReducer } from "./util";
import { v4 as uuidv4 } from "uuid";
import { createTag, hasStreak, isActive, isPending, status } from "./tags";
import { parse } from "./task/parseTask";

const parseTaskString = (str) => {
  // console.log(parse(str));
  return (
    str.match(/(?<task>.*):\s*(?<time>\d+)(\s*-\s*(?<point>\d))?/)?.groups ?? {}
  );
};

const initialState = {
  taskString: "",
  task: "",
  time: 0,
  value: 1,
  id: "",
  active: true,
  tags: [status.active]
};

export const actors = {
  toggleDone: (s) => ({
    ...s,
    tags: s.tags.map((t) =>
      isActive(t) ? status.pending : isPending(t) ? status.active : t
    )
  }),
  setActive: (s) => ({
    ...s,
    tags: s.tags.filter((tag) => !(tag.id in status)).concat(status.active)
  }),
  setPending: (s) => ({
    ...s,
    tags: s.tags.filter((tag) => !(tag.id in status)).concat(status.pending)
  }),
  setDone: (s) => ({
    ...s,
    tags: s.tags.filter((tag) => !(tag.id in status)).concat(status.done)
  }),
  createTask: (s, taskString) => {
    const { time, value = 1, ...taskData } = parseTaskString(taskString);
    return {
      ...initialState,
      ...taskData,
      taskString,
      value: Number(value),
      time: Number(time),
      id: uuidv4(),
      tags: [status.active],
      createdAt: Date.now()
    };
  }
};

export const actions = createActions(actors);

export default createReducer(actors, initialState);

export const getTime = (task) => task.time;
