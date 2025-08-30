import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { join } from 'path';
import { FileService } from './app.service';

@Controller('files')
export class appController {
  constructor(private readonly fileService: FileService) {}

  @Post('convert')
  @UseInterceptors(FileInterceptor('file'))
  async convertToPDF(@UploadedFile() file: Express.Multer.File) {
    const uploadPath = join(__dirname, '../../uploads', file.originalname);
    const pdfPath = uploadPath.replace('.docx', '.pdf');

    // Guardamos el archivo temporalmente
    const fs = await import('fs');
    await fs.promises.writeFile(uploadPath, file.buffer);

    // Convertimos el archivo usando LibreOffice
    await this.fileService.convertDocxToPdf(uploadPath, pdfPath);

    return { message: 'Archivo convertido exitosamente', pdfPath };
  }
}
