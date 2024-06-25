import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { GroupService, GroupServiceAdmin } from './group.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { AdminGuard } from 'src/admin/admin.guard';

@ApiTags('Group')
@Controller('group')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Get()
  findAll() {
    return this.groupService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.groupService.findGroupById(+id);
  }
}

// @UseGuards(AdminGuard)
// @ApiBearerAuth()
@ApiTags('Group', 'Admin')
@Controller('group')
export class GroupControllerAdmin {
  constructor(private readonly groupServiceAdmin: GroupServiceAdmin) {}

  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        description: { type: 'string' },
        // couratorIds: { type: 'array', items: { type: 'number' } },
      },
    },
  })
  @Post()
  async addGroup(@Body() body: CreateGroupDto) {
    try {
      return await this.groupServiceAdmin.create(body);
    } catch (error) {
      throw new HttpException(
        'Не удалось создать группу',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Patch('')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number' },
        name: { type: 'string' },
        description: { type: 'string' },
        couratorIds: { type: 'array', items: { type: 'number' } },
      },
    },
  })
  async updateGroup(@Body() body: UpdateGroupDto) {
    return this.groupServiceAdmin.updateGroup(body);
  }

  @Delete(':couratorId/:groupId')
  async remove(
    @Param('couratorId') couratorId: string,
    @Param('groupId') groupId: string,
  ) {
    return this.groupServiceAdmin.remove(+couratorId, +groupId);
  }

  @Delete(':groupId')
  async removeGroup(@Param('groupId') groupId: string) {
    return this.groupServiceAdmin.removeGroup(+groupId);
  }
}
