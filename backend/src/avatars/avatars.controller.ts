import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    Res,
    StreamableFile,
    UploadedFile,
    UseInterceptors,
    Response,
  } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { AvatarsDto } from './avatars.dto';
import { createReadStream } from 'fs';
import { join } from 'path';
  
  @Controller('avatars')
  export class AvatarsController {
    constructor() {}

    @Get(':fileName')
    getFile(@Response({ passthrough: true }) res, @Param('fileName') fileName): StreamableFile {
      const file = createReadStream(join(process.cwd(), 'upload', fileName));
      res.set({
        'Content-Type': 'image/png',
        'Content-Disposition': `attachment; filename="${fileName}"`,
      });
      return new StreamableFile(file);
    }
    
    @UseInterceptors(FileInterceptor('file'))
    @Post()
    uploadFile(
      @Body() body: AvatarsDto,
      @UploadedFile() file: Express.Multer.File,
    ) {
      return {
        fieldname: file.fieldname,
        originalname: file.originalname,
        encoding: file.encoding,
        mimetype: file.mimetype,
        filename: file.filename,
      };
    }
  }