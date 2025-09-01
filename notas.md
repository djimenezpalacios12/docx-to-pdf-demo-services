1. instalaciones:
   npm install multer @nestjs/platform-express
   npm install --save-dev @types/multer

2. Docker:
   docker build -t docx-pdf-service .
   docker run -p 3000:3000 docx-pdf-service

## Codigos:

### Dockers:

```dockerfile
FROM node:18-slim

# Instalar dependencias del sistema y LibreOffice

RUN apt-get update && apt-get install -y \
 libreoffice \
 fonts-dejavu \
 && rm -rf /var/lib/apt/lists/\*

WORKDIR /app

COPY package\*.json ./
RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["node", "dist/main"]
```

### Module

```TS
import { Module } from '@nestjs/common';
import { appController } from './app.controller';
import { FileService } from './app.service';

@Module({
  imports: [],
  controllers: [appController],
  providers: [FileService],
})
export class AppModule {}

```

### controller

```TS
import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { join } from 'path';
import { FileInterceptor } from '@nestjs/platform-express';

import { FileService } from './app.service';

@Controller('files')
export class appController {
  constructor(private readonly fileService: FileService) {}

  @Post('convert')
  @UseInterceptors(FileInterceptor('file'))
  async convertToPDF(@UploadedFile() file: Express.Multer.File) {
    const uploadPath = join(process.cwd(), 'uploads', file.originalname);
    const pdfPath = uploadPath.replace('.docx', '.pdf');

    // Guardamos el archivo temporalmente
    const fs = await import('fs');
    await fs.promises.writeFile(uploadPath, file.buffer);

    // Convertimos el archivo usando LibreOffice
    await this.fileService.convertDocxToPdf(uploadPath, pdfPath);

    return { message: 'Archivo convertido exitosamente', pdfPath };
  }
}

```

### services

```TS
import { Injectable } from '@nestjs/common';
import { exec } from 'child_process';
import { promisify } from 'util';
import { join } from 'path';
import * as os from 'os';

const execPromise = promisify(exec);

@Injectable()
export class FileService {
  async convertDocxToPdf(inputPath: string, outputPath: string): Promise<void> {
    const outputDir = join(outputPath, '..');

    // * Script original para linux/windowss
    // const command = `libreoffice --headless --convert-to pdf --outdir "${outputDir}" "${inputPath}"`;

    // * Script para macos
    // const command = `/Applications/LibreOffice.app/Contents/MacOS/soffice --headless --convert-to pdf --outdir "${outputDir}" "${inputPath}"`;

    // * Solucion con docker/OS
    // Detectar sistema operativo
    let libreOfficeCmd = 'libreoffice';
    if (os.platform() === 'darwin') {
      // macOS
      libreOfficeCmd = '/Applications/LibreOffice.app/Contents/MacOS/soffice';
    } else if (os.platform() === 'win32') {
      // Windows: si en algún futuro se usa allí
      libreOfficeCmd = 'soffice.exe';
    }

    const command = `${libreOfficeCmd} --headless --convert-to pdf --outdir "${outputDir}" "${inputPath}"`;

    try {
      await execPromise(command);
    } catch (error) {
      throw new Error(`Error al convertir .Docx a PDF: ${error}`);
    }
  }
}

```
