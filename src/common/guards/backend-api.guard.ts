// import {
//   CanActivate,
//   ExecutionContext,
//   Injectable,
//   UnauthorizedException,
// } from '@nestjs/common';

// @Injectable()
// export class BackendApiGuard implements CanActivate {
//   canActivate(context: ExecutionContext): boolean {
//     const req = context.switchToHttp().getRequest();
//     const auth = req.headers['authorization'];

//     if (!auth) throw new UnauthorizedException('Missing Authorization header');

//     const token = auth.split(' ')[1];
//     if (token !== process.env.BACKEND_API_TOKEN) {
//       throw new UnauthorizedException('Invalid API token');
//     }

//     return true;
//   }
// }
