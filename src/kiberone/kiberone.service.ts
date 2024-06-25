import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateKiberoneDto } from './dto/create-kiberone.dto';
import { UpdateKiberoneDto } from './dto/update-kiberone.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class KiberoneService {
  constructor(private readonly prisma: PrismaService) {}

  async create(body: CreateKiberoneDto) {
    const kiberone = await this.prisma.kiberone.create({
      data: {
        ...body,
      },
    });
    return kiberone;
  }

  findAll() {
    const kiberone = this.prisma.kiberone.findMany();
    return kiberone;
  }

  async findKiberoneById(id: number) {
    try {
      const kiberone = await this.prisma.kiberone.findUnique({
        where: {
          id: id,
        },
      });
      return kiberone;
    } catch (error) {
      throw new HttpException(
        'Failed to update kiberone',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async updateKiberone(body: UpdateKiberoneDto) {
    try {
      const kiberone = await this.prisma.kiberone.update({
        where: {
          id: +body.id,
        },
        data: {
          ...body,
        },
      });
      return kiberone;
    } catch (error) {
      throw new HttpException(
        'Failed to update kiberone',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async remove(id: number) {
    try {
      const kiberone = await this.prisma.kiberone.delete({
        where: {
          id: id,
        },
      });
      return kiberone;
    } catch (error) {
      throw new HttpException(
        'Failed to delete kiberone',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
