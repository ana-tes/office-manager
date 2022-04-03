import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    Res,
    HttpStatus,
    NotFoundException,
    StreamableFile,
    UploadedFile,
    UseInterceptors,
    Response,
    Delete,
  } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { AvatarsDto } from './avatars.dto';
import { createReadStream, unlinkSync, existsSync } from 'fs';
import { join } from 'path';
  
@Controller('avatars')
export class AvatarsController {
  constructor() {}

  @Get(':fileName')
  getFile(@Response({ passthrough: true }) res, @Param('fileName') fileName): StreamableFile {

    var filePath = join(process.cwd(), 'upload', fileName);
    if (!existsSync(filePath)) {
      throw new NotFoundException('Avatar not found');
    }
    const file = createReadStream(filePath);
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
  
  @Delete(':fileName')
  deleteAvatar(@Res() res, @Param('fileName') fileName) {
    var filePath = join(process.cwd(), 'upload', fileName);
    if (!existsSync(filePath)) {
      throw new NotFoundException('Avatar not found');
    }

    unlinkSync(filePath);
    return res.status(HttpStatus.OK).json({
      message: 'Avatar has been deleted!',
    });
  }
}