import * as bcrypt from 'bcrypt';

const hash = '$2b$10$VzEKztgl.3xdtQXclZAqrOyqAISDqAuXWv.iMIWAJjJjYJ32fbzQS';
const passwordToCheck = 'test1234';

async function check() {
  const match = await bcrypt.compare(passwordToCheck, hash);
  console.log(match ? 'Пароль співпадає!' : 'Пароль НЕ співпадає.');
}

check();
