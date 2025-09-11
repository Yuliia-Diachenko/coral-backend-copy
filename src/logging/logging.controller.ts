import * as path from 'path';
import {
  Controller,
  Get,
  HttpStatus,
  Logger,
  Param,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { LoggingService } from './logging.service';

@Controller('log-access')
export class LoggingController {
  logger: Logger;
  constructor(private readonly loggingService: LoggingService) {
    this.logger = new Logger('Auth LOGGING');
  }

  @Get('logs/:directory')
  async listLogs(@Param('directory') directory: string = '') {
    return await this.loggingService.getLogFiles(directory);
  }

  @Get('logs/download/:subPath(*)')
  async downloadLog(@Param('subPath') subPath: string, @Res() res: Response) {
    try {
      const logStream = await this.loggingService.getLogStream(subPath);
      res.set({
        'Content-Type': 'text/plain',
        'Content-Disposition': `attachment; filename="${path.basename(subPath)}"`,
      });
      logStream.pipe(res);
    } catch (error) {
      this.logger.error('Error logging:', error);
      res.status(HttpStatus.NOT_FOUND).json({ message: error.message });
    }
  }
}
