import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AuthGuard } from './auth/auth.gard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule,  { cors: true });
  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
  .setTitle('API Nest js')
  .setDescription('Nest JS project')
  .setVersion('1.0')
  .addTag('api')
  .addBearerAuth()
  .build()
  

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
