import React, { PureComponent } from "react";
import "./styles.scss";
import moment from "moment";
// import ObjectInspector from "react-object-inspector";
import store, { actions as appActions, taskActions } from "./state";
import { hasDone, hasRecurring } from "./state/tags";
import { connect, Provider } from "react-redux";
import { List } from "./components/List";
// import { actions as taskActions } from "./state/task";
// import { actions as collectionActions } from "./state/collection";
import { forwardEventVal, onEnter } from "./components/eventPipes";
const not = (func) => (...args) => !func(...args);
console.tap = (v, ...rest) => (console.log(v, ...rest), v);
console.tap.label = (label, style) => (v, ...rest) => (
  console.log(`%c${label}`, style, v, ...rest), v
);

const grid = 8;

async function notifyMe(note) {
  // Let's check if the browser supports notifications
  const permission =
    (await Notification.permission) === "default"
      ? Notification.requestPermission()
      : Notification.permission;

  // Let's check whether notification permissions have already been granted
  if (permission === "granted") {
    // If it's okay let's create a notification
    var notification = new Notification(note);
  }

  // Otherwise, we need to ask the user for permission
  else if (permission !== "denied") {
    Notification.requestPermission().then(function (permission) {
      // If the user accepts, let's create a notification
      if (permission === "granted") {
        var notification = new Notification(note);
      }
    });
  }

  // At last, if the user has denied notifications, and you
  // want to be respectful there is no need to bother them any more.
}

class App extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  tasksWithRealTime(tasks, startTime = moment("08:00", "HH:mm")) {
    return tasks
      .filter((t) => Number.isFinite(t.time))
      .map((task) => {
        const newTask = {
          ...task,
          realTime: startTime.format("hh:mm")
        };

        startTime.add(task.time, "minute");
        return newTask;
      });
  }

  // Normally you would want to split things out into separate components.
  // But in this example everything is just done in one place for simplicity
  render() {
    const {
      bank,
      resolveDay,
      tasks,
      addTask,
      bulkAddTasks,
      totalTime,
      debug,
      setTaskList
    } = this.props;

    const tasksWithRealTime = this.tasksWithRealTime(tasks).filter(
      not(hasDone)
    );
    const dailies = tasksWithRealTime.filter(hasRecurring);
    const veggies = tasksWithRealTime.filter(not(hasRecurring));
    return (
      <main>
        <aside id="meta-sidebar">
          <h3>
            Bank: <code>{bank}</code>
          </h3>
          <h5>Add New task</h5>
          <textarea
            id="single-task-input"
            onKeyUp={onEnter(forwardEventVal(addTask))}
          />
          <h5>Bulk Add</h5>
          <textarea
            id="task-input"
            value={this.state.text}
            onKeyUp={onEnter(
              forwardEventVal((str) => bulkAddTasks(str.split("\n")))
            )}
          />
          {/* <ObjectInspector
            data={tasksWithRealTime}
            initialExpandedPaths={["root", "root.*"]}
          /> */}
          <button
            onClick={() => {
              navigator.clipboard
                .writeText(
                  tasks
                    .filter(not(hasDone))
                    .map((t) => t.taskString.trim())
                    .filter((v) => v)
                    .join("\n")
                )
                .then(() => notifyMe("Tasks Copied"))
                .catch(console.error);
            }}
          >
            copy task string
          </button>
        </aside>
        <details>
          <summary>Dailies</summary>
          <List
            items={dailies}
            setTaskList={setTaskList}
            totalTime={totalTime}
          />
        </details>
        <details>
          <summary>Veggies</summary>
          <List
            items={veggies}
            setTaskList={setTaskList}
            totalTime={totalTime}
          />
        </details>
        {/* <details>
          <summary>Desert</summary>
          Something small enough to escape casual notice.
        </details> */}

        <aside className="controls">
          <button onClick={resolveDay}>Resolve Day</button>
          <button onClick={debug._fullReset}>Full Reset</button>
        </aside>
      </main>
    );
  }
}

const ConnectedApp = connect(
  (s) => s,
  (dispatch) => ({
    bulkAddTasks: (tasks) =>
      dispatch(taskActions.bulk(tasks.map((t) => taskActions.createTask(t)))),
    addTask: (str) => dispatch(taskActions.createTask(str)),
    resolveDay: () => dispatch(appActions._resolveDay()),
    debug: {
      _fullReset: () => dispatch(appActions._fullReset())
    },
    setTaskList: (tasks) => dispatch(appActions.setTaskList(tasks))
  })
)(App);

// export default App;
export default () => (
  <Provider store={store}>
    <ConnectedApp />
  </Provider>
);
