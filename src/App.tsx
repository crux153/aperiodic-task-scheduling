import React, { useState } from "react";
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

  const backgroundSchedule = backgroundScheduler(periodicTasks, aperiodicTasks);
  const pollingServerSchedule = pollingServerScheduler(
    periodicTasks,
    aperiodicTasks,
    pollingServer
  );

  return (
    <div className="App" style={{ padding: 50 }}>
      <div>
        <h3>Periodic Tasks: </h3>
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
              Computation Time: {task.computationTime}, Period: {task.period}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3>Aperiodic Tasks: </h3>
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
              {task.arrivalTime}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3>Polling Server: </h3>
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
