import React from "react";
import { connect } from "react-redux";
import { actions } from "../state/task";
import { actions as taskList } from "../state/collection";
import { Checkbox, IconButton } from "@material-ui/core";
import CancelIcon from "@material-ui/icons/Cancel";
import { ErrorBoundary } from "./ErrorBoundary";
import { hasPending } from "../state/tags";
import { withReward } from "./withReward";
import ReactMarkdown from "react-markdown";

import yay from "../yay.mp3";

const CheckBox = withReward(
  ({ triggerReward, toggleState, task, triggerYay }) => (
    <Checkbox
      checked={hasPending(task)}
      color="primary"
      onChange={() => {
        if (task.active) {
          triggerReward();
          triggerYay();
        }
        toggleState();
      }}
    />
  )
);

export const Task = ({
  task,
  realTime,
  toggleDone,
  dragRef,
  dragStyle,
  percentTime,
  removeTask,
  ...dragProps
}) => {
  const audio = new Audio(yay);
  return (
    <ErrorBoundary>
      <div
        key={task.id}
        className="task"
        ref={dragRef}
        {...dragProps}
        style={{
          ...dragStyle,
          minHeight: `calc(20px + ${Math.max(
            hasPending(task) ? 0 : percentTime,
            4
          )}vh)`,
          textDecoration: hasPending(task) ? "line-through" : "none"
        }}
      >
        <span style={{ display: "block" }}>
          <CheckBox
            task={task}
            triggerYay={() => audio.play()}
            toggleState={() => toggleDone(task.id)}
            config={{
              elementCount: 8,
              spread: 180,
              angle: 45
            }}
          />
        </span>
        <span>
          <a
            target="_blank"
            href={`https://www.google.com/search?q=timer+${task.time}+min`}
          >
            {task.time}
          </a>
          <ReactMarkdown className="task-body" linkTarget="_blank">
            {task.task}
          </ReactMarkdown>
          :{task.value}
        </span>
        <span>{task.realTime}</span>
        <IconButton onClick={() => removeTask(task.id)}>
          <CancelIcon />
        </IconButton>
      </div>
    </ErrorBoundary>
  );
};
export default connect(
  () => ({}),
  (dispatch) => ({
    toggleDone: (t) => dispatch(actions.toggleDone(t)),
    removeTask: (id) => dispatch(taskList.remove(id))
  })
)(Task);
