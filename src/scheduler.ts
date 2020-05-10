export interface PeriodicTask {
  computationTime: number;
  period: number;
}

export interface AperiodicTask {
  computationTime: number;
  arrivalTime: number;
}

export class BackgroundAperiodicTaskScheduler {
  periodicTasks = [];
  aperiodicTasks = [];

  addPeriodicTask(task: PeriodicTask) {}

  addAperiodicTask(task: AperiodicTask) {}
}
