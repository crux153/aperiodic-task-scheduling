import React, { useState, useMemo, useCallback } from "react";
import randomColor from "randomcolor";
import {
  PeriodicTask,
  AperiodicTask,
  PollingServer,
  backgroundScheduler,
  pollingServerScheduler,
} from "./scheduler";
import { Schedule } from "./Schedule";
import { average } from "./math";

import "./App.css";

const defaultPeriodicTasks = [
  {
    color: randomColor(),
    computationTime: 1,
    period: 5,
  },
  {
    color: randomColor(),
    computationTime: 1,
    period: 10,
  },
  {
    color: randomColor(),
    computationTime: 1,
    period: 15,
  },
  {
    color: randomColor(),
    computationTime: 3,
    period: 30,
  },
  {
    color: randomColor(),
    computationTime: 5,
    period: 60,
  },
];

const defaultAperiodicTasks = [
  {
    color: randomColor(),
    computationTime: 2,
    arrivalTime: 7,
  },
  {
    color: randomColor(),
    computationTime: 1,
    arrivalTime: 10,
  },
  {
    color: randomColor(),
    computationTime: 1,
    arrivalTime: 29,
  },
];

const defaultPollingServer = {
  color: randomColor(),
  capacity: 1,
  period: 5,
};

function App() {
  const [periodicTasks, setPeriodicTasks] = useState<PeriodicTask[]>(
    defaultPeriodicTasks
  );
  const [aperiodicTasks, setAperiodicTasks] = useState<AperiodicTask[]>(
    defaultAperiodicTasks
  );
  const [pollingServer, setPollingServer] = useState<PollingServer>(
    defaultPollingServer
  );

  const backgroundSchedule = useMemo(
    () => backgroundScheduler(periodicTasks, aperiodicTasks),
    [periodicTasks, aperiodicTasks]
  );

  const pollingServerSchedule = useMemo(
    () => pollingServerScheduler(periodicTasks, aperiodicTasks, pollingServer),
    [periodicTasks, aperiodicTasks, pollingServer]
  );

  const addPeriodicTask = useCallback(() => {
    const computationTime = parseInt(prompt("Computation Time: ") || "", 10);
    const period = parseInt(prompt("Period: ") || "", 10);

    if (!computationTime || !period) {
      return alert("Wrong value!");
    }

    setPeriodicTasks((tasks) => [
      ...tasks,
      {
        color: randomColor(),
        computationTime,
        period,
      },
    ]);
  }, []);

  const addAperiodicTask = useCallback(() => {
    const computationTime = parseInt(prompt("Computation Time: ") || "", 10);
    const arrivalTime = parseInt(prompt("Arrival Time: ") || "", 10);

    if (!computationTime || !arrivalTime) {
      return alert("Wrong value!");
    }

    setAperiodicTasks((tasks) => [
      ...tasks,
      {
        color: randomColor(),
        computationTime,
        arrivalTime,
      },
    ]);
  }, []);

  const editAperiodicTask = useCallback(() => {
    const capacity = parseInt(prompt("Capacity: ") || "", 10);
    const period = parseInt(prompt("Period: ") || "", 10);

    if (!capacity || !period) {
      return alert("Wrong value!");
    }

    setPollingServer({
      color: randomColor(),
      capacity,
      period,
    });
  }, []);

  return (
    <div className="App" style={{ padding: 50 }}>
      <div>
        <h3>
          Periodic Tasks: <button onClick={addPeriodicTask}>Add</button>
        </h3>
        <ul>
          {periodicTasks.map((task, idx) => (
            <li key={idx}>
              <div
                style={{
                  display: "inline-block",
                  width: 10,
                  height: 10,
                  border: "1px solid black",
                  backgroundColor: task.color,
                }}
              />{" "}
              Computation Time: {task.computationTime}, Period: {task.period}{" "}
              <button
                onClick={() =>
                  setPeriodicTasks((tasks) =>
                    tasks.filter((value) => value !== task)
                  )
                }
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3>
          Aperiodic Tasks: <button onClick={addAperiodicTask}>Add</button>
        </h3>
        <ul>
          {aperiodicTasks.map((task, idx) => (
            <li key={idx}>
              <div
                style={{
                  display: "inline-block",
                  width: 10,
                  height: 10,
                  border: "1px solid black",
                  backgroundColor: task.color,
                }}
              />{" "}
              Computation Time: {task.computationTime}, Arrival Time:{" "}
              {task.arrivalTime}{" "}
              <button
                onClick={() =>
                  setAperiodicTasks((tasks) =>
                    tasks.filter((value) => value !== task)
                  )
                }
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3>
          Polling Server: <button onClick={editAperiodicTask}>Edit</button>
        </h3>
        <ul>
          <li>
            <div
              style={{
                display: "inline-block",
                width: 10,
                height: 10,
                border: "1px solid black",
                backgroundColor: pollingServer.color,
              }}
            />{" "}
            Capacity: {pollingServer.capacity}, Period: {pollingServer.period}
          </li>
        </ul>
      </div>

      <div className="result">
        <h3>Background Aperiodic Scheduler: </h3>
        <p>Average Waiting Time: {average(backgroundSchedule.waitingTimes)}</p>
        <Schedule schedule={backgroundSchedule.schedule} />
      </div>

      <div className="result">
        <h3>Polling Server Scheduler: </h3>
        <p>
          Average Waiting Time: {average(pollingServerSchedule.waitingTimes)}
        </p>
        <Schedule schedule={pollingServerSchedule.schedule} />
      </div>
    </div>
  );
}

export default App;
