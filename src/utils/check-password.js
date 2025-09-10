import * as bcrypt from 'bcrypt';
import { Logger } from '@nestjs/common';

const hash = '$2b$10$VzEKztgl.3xdtQXclZAqrOyqAISDqAuXWv.iMIWAJjJjYJ32fbzQS';
const passwordToCheck = 'test1234';

const logger = new Logger('Prisma LOGGER');

async function check() {
  const match = await bcrypt.compare(passwordToCheck, hash);
  logger.log(match ? 'Password matches!' : 'Password NOT matches!');
}

check();
