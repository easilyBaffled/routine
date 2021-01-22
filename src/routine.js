import moment from "moment";

console.tap = (v, ...rest) => (console.log(v, ...rest), v);
console.tap.label = (label, style) => (v, ...rest) => (
  console.log(`%c${label}`, style, v, ...rest), v
);

export function toTasks([taskString]) {
  return taskString
    .split("\n")
    .filter((s) => s.trim() !== "")
    .map((s) => s.trim().split(": "))
    .reduce((acc, [task, time]) => ({ ...acc, [task]: Number(time) }), {});
}

export const taskToString = ({ task, time }) => `${task}: ${time}`;

const routine = {
  standards: {
    // totalTime: 226,
    morning: {
      tasks: {
        shower: 10,
        brush: 4,
        bed: 8,
        headspace: 18,
        email: 20,
        standup: 15,
        breakfast: 30
      },
      start: moment("08:00", "HH:mm")
    },
    throughout: {
      tasks: {
        paper: 25,
        read: 16,
        stretch: 20,
        lunch: 30,
        "RWM - what is expo's navitaiton": 30
      }
    }
  },
  dayOf: {
    points: {
      tasks: toTasks`
        return car: 60        
        `
    },
    wrk: {
      tasks: toTasks`
      poke nathan: 5      
      poke Aiden: 5
      bulk section update - draft BL: 25
      bulk section update - draft test mocks: 25
      bulk section update - write BL: 60
      bulk section update - write tests: 90       
      `
    }
  }
};

const sumTaskTime = (tasks) => Object.values(tasks).reduce((s, t) => s + t);

const addTimeBlocking = ({ tasks, start }) => {
  const totalTime = sumTaskTime(tasks);
  if (!start) {
    return { tasks, totalTime };
  }
  const end = moment(start).add(totalTime, "minute");
  return { tasks, start, end, totalTime };
};

const isObject = (obj) =>
  (obj ?? false) && typeof obj === "object" && !Array.isArray(obj);

function walk(obj) {
  if (obj.tasks) {
    return addTimeBlocking(obj);
  } else {
    return !isObject(obj)
      ? obj
      : Object.entries(obj).reduce(
          (acc, [k, v]) => ({
            ...acc,
            [k]: walk(v)
          }),
          {}
        );
  }
}

function totalTotalTime(obj) {
  if (obj.totalTime) {
    return obj.totalTime;
  } else {
    return !isObject(obj)
      ? 0
      : Object.values(obj).reduce(
          (total, entry) => total + totalTotalTime(entry),
          0
        );
  }
}

export const taskListToTaskObjects = (baseTaskList) => {
  const realTime = moment("08:00", "HH:mm");
  const totalTime = Object.values(baseTaskList).reduce((sum, v) => sum + v);

  return Object.entries(baseTaskList).map((task, i) =>
    entryToTaskObj(task, realTime, totalTime, i)
  );
};

const entryToTaskObj = ([task, time], realTime, totalTime, i) => {
  const taskObj = {
    task,
    time,
    percent: (Number(time) / totalTime) * 100,
    id: `${task}-${time}-${i}`,
    active: true,
    realTime: realTime.format("hh:mm")
  };
  realTime.add(time, "m");
  return taskObj;
};

export class Task {
  static getTime(task) {
    return task.time;
  }
}

export const getTotalTime = (taskList) =>
  taskList.reduce((acc, task) => acc + Task.getTime(task), 0);

function asList(obj, totalTime) {
  if (obj.tasks)
    return Object.entries(obj.tasks).map(([task, time]) => ({
      task,
      time,
      percent: (time / totalTime) * 100,
      id: `${task}-${time}`,
      active: true
    }));
  else
    return !isObject(obj)
      ? []
      : Object.values(obj)
          .map((o) => asList(o, totalTime))
          .flat();
}

const withRealTimes = (taskList) => {
  var start = moment("08:00", "HH:mm");
  return taskList.map((t) => {
    t.realTime = start.format("hh:mm");
    start.add(t.time, "m");
    return t;
  });
};

export const toTimeBoxes = (taskList) => {
  var start = moment("08:00", "HH:mm");
  return taskList
    .map(({ task, time }) => {
      const s = `- [ ] ${start.format("hh:mm")}\t${task}`;
      start.add(time, "m");
      return s;
    })
    .join("\n");
};

const r = walk(routine); // 566
r.totalTime = totalTotalTime(r);
r.totalTimeH = r.totalTime / 60;
r.doneAt = moment("08:00", "HH:mm").add(r.totalTime, "m").format("hh:mm a");

r.taskList = asList(r, r.totalTime);

export default r;
