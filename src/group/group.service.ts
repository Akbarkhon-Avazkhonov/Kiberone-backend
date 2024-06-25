import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { PrismaService } from '../prisma.service';

@Injectable()
export class GroupService {
  constructor(public readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.group.findMany({
      orderBy: {
        id: 'desc',
      },
      include: {
        _count: {
          select: {
            students: true,
            courators: true,
            homework: true,
          },
        },
      },
    });
  }

  async findGroupById(id: number) {
    try {
      const group = await this.prisma.group.findUnique({
        where: {
          id: id,
        },
        include: {
          homework: {
            select: {
              id: true,
              title: true,
              deadline: true,
            },
          },
          courators: {
            include: {
              courator: true,
            },
          },
        },
      });
      if (!group) {
        throw new HttpException('Group not found', HttpStatus.NOT_FOUND);
      }
      return group;
    } catch (error) {
      throw new HttpException('Failed to find group', HttpStatus.BAD_REQUEST);
    }
  }
}

export class GroupServiceAdmin extends GroupService {
  async create(body: CreateGroupDto) {
    try {
      const group = await this.prisma.group.create({
        data: {
          name: body.name,
          description: body.description,
        },
      });
      return group;
    } catch (error) {
      throw new Error(`Failed to create group: ${error.message}`);
    }
  }

  async updateGroup(body: UpdateGroupDto) {
    try {
      const id = +body.id;
      const group = await this.prisma.group.update({
        where: {
          id: id,
        },
        data: {
          name: body.name,
          description: body.description,
        },
      });

      await this.prisma.groupCourator.deleteMany({
        where: {
          groupId: id,
        },
      });
      await this.prisma.groupCourator.createMany({
        data: body.couratorIds.map((couratorId) => ({
          groupId: id,
          couratorId: couratorId,
        })),
      });

      return group;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async remove(couratorId: number, groupId: number) {
    try {
      const groupCourator = await this.prisma.groupCourator.deleteMany({
        where: {
          couratorId,
          groupId,
        },
      });
      return groupCourator;
    } catch (error) {
      throw new HttpException(
        error.message ?? 'Failed to remove groupCourator',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  async removeGroup(groupId: number) {
    try {
      const group = await this.prisma.group.delete({
        where: {
          id: groupId,
        },
      });
      return group;
    } catch (error) {
      throw new HttpException(
        error.message ?? 'Failed to remove group',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
