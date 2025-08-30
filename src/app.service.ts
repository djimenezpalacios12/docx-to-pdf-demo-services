import { Injectable } from '@nestjs/common';
import { exec } from 'child_process';
import { promisify } from 'util';
import { join } from 'path';

const execPromise = promisify(exec);

@Injectable()
export class FileService {
  async convertDocxToPdf(inputPath: string, outputPath: string): Promise<void> {
    const outputDir = join(outputPath, '..');
    const command = `libreoffice --headless --convert-to pdf --outdir "${outputDir}" "${inputPath}"`;

    try {
      await execPromise(command);
    } catch (error) {
      throw new Error(`Error al convertir DOCX a PDF: ${error}`);
    }
  }
}
