import { lcm } from "./math";

export interface PeriodicTask {
  color: string;
  computationTime: number;
  period: number;
}

export interface AperiodicTask {
  color: string;
  computationTime: number;
  arrivalTime: number;
}

export interface PollingServer {
  color: string;
  capacity: number;
  period: number;
}

export function backgroundScheduler(
  inputPeriodicTasks: PeriodicTask[],
  inputAperiodicTasks: AperiodicTask[]
) {
  // Deep clone
  const periodicTasks: PeriodicTask[] = JSON.parse(
    JSON.stringify(inputPeriodicTasks)
  );
  const aperiodicTasks: AperiodicTask[] = JSON.parse(
    JSON.stringify(inputAperiodicTasks)
  );

  const hyperPeriod = lcm(periodicTasks.map((task) => task.period));
  const schedule: (string | null)[] = new Array(hyperPeriod).fill(null);
  const waitingTimes: number[] = [];

  // Order by shortest period
  periodicTasks.sort((taskA, taskB) => {
    return taskA.period < taskB.period
      ? -1
      : taskA.period > taskB.period
      ? 1
      : 0;
  });

  // FIFS
  aperiodicTasks.sort((taskA, taskB) => {
    return taskA.arrivalTime < taskB.arrivalTime
      ? -1
      : taskA.arrivalTime > taskB.arrivalTime
      ? 1
      : 0;
  });

  for (const task of periodicTasks) {
    const numberOfExecution = hyperPeriod / task.period;
    for (let idx = 0; idx < numberOfExecution; idx++) {
      let computation = task.computationTime;

      const section = idx * task.period;
      const nextSection = section + task.period;

      for (let time = section; time < nextSection; time++) {
        if (schedule[time] === null) {
          schedule[time] = task.color;
          computation--;

          if (computation === 0) {
            break;
          }
        }
      }
    }
  }

  for (const task of aperiodicTasks) {
    for (let time = task.arrivalTime; time < schedule.length; time++) {
      if (schedule[time] === null) {
        schedule[time] = task.color;
        task.computationTime--;

        if (task.computationTime === 0) {
          waitingTimes.push(time - task.arrivalTime);
          break;
        }
      }
    }
  }

  return { schedule, waitingTimes };
}

export function pollingServerScheduler(
  inputPeriodicTasks: PeriodicTask[],
  inputAperiodicTasks: AperiodicTask[],
  inputPollingServer: PollingServer
) {
  // Deep clone
  const periodicTasks: PeriodicTask[] = JSON.parse(
    JSON.stringify(inputPeriodicTasks)
  );
  const aperiodicTasks: AperiodicTask[] = JSON.parse(
    JSON.stringify(inputAperiodicTasks)
  );
  const pollingServer: PollingServer = JSON.parse(
    JSON.stringify(inputPollingServer)
  );

  const allPeriodicTasks = [...periodicTasks, pollingServer];
  const hyperPeriod = lcm(allPeriodicTasks.map((task) => task.period));
  const schedule: (string | null)[] = new Array(hyperPeriod).fill(null);
  const waitingTimes: number[] = [];

  // Order by shortest period
  allPeriodicTasks.sort((taskA, taskB) => {
    return taskA.period < taskB.period
      ? -1
      : taskA.period > taskB.period
      ? 1
      : 0;
  });

  // FIFS
  aperiodicTasks.sort((taskA, taskB) => {
    return taskA.arrivalTime < taskB.arrivalTime
      ? -1
      : taskA.arrivalTime > taskB.arrivalTime
      ? 1
      : 0;
  });

  for (const task of allPeriodicTasks) {
    const numberOfExecution = hyperPeriod / task.period;
    for (let idx = 0; idx < numberOfExecution; idx++) {
      const section = idx * task.period;
      const nextSection = section + task.period;
      let computation =
        "capacity" in task ? task.capacity : task.computationTime;

      for (let time = section; time < nextSection; time++) {
        // Server task
        if ("capacity" in task) {
          if (
            schedule[time] === null &&
            aperiodicTasks.length &&
            time >= aperiodicTasks[0].arrivalTime
          ) {
            schedule[time] = aperiodicTasks[0].color;
            aperiodicTasks[0].computationTime--;
            computation--;

            if (aperiodicTasks[0].computationTime === 0) {
              waitingTimes.push(time - aperiodicTasks[0].arrivalTime);
              aperiodicTasks.shift();
            }
            if (computation === 0) {
              break;
            }
          }
        } else {
          if (schedule[time] === null) {
            schedule[time] = task.color;
            computation--;

            if (computation === 0) {
              break;
            }
          }
        }
      }
    }
  }

  return { schedule, waitingTimes };
}
