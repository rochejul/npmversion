import ProcLog from 'proc-log';

function chainMessage(stages, message) {
  const blocks = [...stages, message];
  return blocks.join(' - ');
}

export class Logger {
  #stages = [];

  constructor(stages) {
    this.#stages = stages;
  }

  error(message) {
    ProcLog.log.error(chainMessage(this.#stages, message));
  }

  info(message) {
    ProcLog.log.info(chainMessage(this.#stages, message));
  }

  verbose(message) {
    ProcLog.log.verbose(chainMessage(this.#stages, message));
  }

  warn(message) {
    ProcLog.log.warn(chainMessage(this.#stages, message));
  }

  subLogger(stage) {
    return new Logger([...this.#stages, stage]);
  }
}
