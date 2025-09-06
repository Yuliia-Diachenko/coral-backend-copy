import * as path from 'path';
import { Controller, Get, HttpStatus, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { LoggingService } from './logging.service';

@Controller('log-access')
export class LoggingController {
  constructor(private readonly loggingService: LoggingService) {}

  @Get('logs/:directory')
  async listLogs(@Param('directory') directory: string = '') {
    return await this.loggingService.getLogFiles(directory);
  }

  @Get('logs/download/*subPath')
  async downloadLog(@Param('subPath') subPath: string, @Res() res: Response) {
    try {
      const logStream = await this.loggingService.getLogStream(subPath);
      res.set({
        'Content-Type': 'text/plain',
        'Content-Disposition': `attachment; filename="${path.basename(subPath)}"`,
      });
      logStream.pipe(res);
    } catch (error) {
      res.status(HttpStatus.NOT_FOUND).json({ message: error.message });
    }
  }
}
