import { Injectable } from '@angular/core';
import {Logger} from "angular2-logger/core";
import * as Config from '../../config/config';

@Injectable()
export class LoggerService {

  public log: Logger;

  constructor(public logger: Logger) {
    this.log = this.logger;
    // Set the log level using the config value
    switch(Config.data.LogLevel) {
      case "OFF":
        this.log.level = this.logger.Level.OFF;
        break;
      case "ERROR":
        this.log.level = this.logger.Level.ERROR;
        break;
      case "WARN":
        this.log.level = this.logger.Level.WARN;
        break;
      case "INFO":
        this.log.level = this.logger.Level.INFO;
        break;
      case "DEBUG":
        this.log.level = this.logger.Level.DEBUG;
        break;
      default:
        this.log.level = this.logger.Level.LOG;
    }
    console.log("Log level is ", this.log.level);
  }

}
