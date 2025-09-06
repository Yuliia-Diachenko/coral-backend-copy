import { Injectable, NotFoundException } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
import * as fsPromises from 'fs/promises';
import * as zlib from 'zlib';

@Injectable()
export class LoggingService {
  private readonly logsDirPath: string;

  constructor() {
    this.logsDirPath = process.env.APP_LOGS_DIR_PATH || './logs';
  }

  async getLogStream(subPath: string): Promise<fs.ReadStream | zlib.Gunzip> {
    const logFilePath = path.join(this.logsDirPath, subPath);

    try {
      const stats = await fsPromises.stat(logFilePath);
      if (!stats.isFile()) {
        throw new NotFoundException(`Path ${subPath} is not a file.`);
      }
      const readStream = fs.createReadStream(logFilePath);
      return logFilePath.endsWith('.gz')
        ? readStream.pipe(zlib.createGunzip())
        : readStream;
    } catch {
      throw new NotFoundException(`Log file ${subPath} not found.`);
    }
  }

  async getLogFiles(directory: string = ''): Promise<string[]> {
    const dirPath = path.join(this.logsDirPath, directory);

    try {
      const files = await fsPromises.readdir(dirPath);
      return files.map((file) => path.join(directory, file));
    } catch {
      throw new NotFoundException(`Directory ${directory} not found.`);
    }
  }
}
