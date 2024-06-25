import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { KiberoneService } from './kiberone.service';
import { CreateKiberoneDto } from './dto/create-kiberone.dto';
import { UpdateKiberoneDto } from './dto/update-kiberone.dto';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { AdminGuard } from 'src/admin/admin.guard';

// @UseGuards(AdminGuard)
// @ApiBearerAuth()
@ApiTags('Kiberone', 'Admin')
@Controller('kiberone')
export class KiberoneController {
  constructor(private readonly kiberoneService: KiberoneService) {}

  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        amount: { type: 'number' },
        studentId: { type: 'number' },
        couratorId: { type: 'number' },
        reason: { type: 'string' },
        isApproved: { type: 'boolean', default: false },
      },
    },
  })
  @Post()
  async addStudent(
    @Body()
    body: CreateKiberoneDto,
  ) {
    return this.kiberoneService.create(body);
  }

  @Get()
  findAll() {
    return this.kiberoneService.findAll();
  }

  @Patch(':id')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number' },
        isApproved: { type: 'boolean' },
      },
    },
  })
  async updateKiberone(@Body() body: UpdateKiberoneDto) {
    return this.kiberoneService.updateKiberone(body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.kiberoneService.remove(+id);
  }
}
