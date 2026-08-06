import { Header, Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  @Header('Content-Type', 'text/html')
  getHello(): string {
    return `
      <!DOCTYPE html>
      <html>
        <head><title>procurement app</title></head>
        <body>
          <h1 F>procurement-mini</h1>
          <p >Hello,This is procurement-mini app !</p>
        </body>
      </html>
    `;
  }
}
