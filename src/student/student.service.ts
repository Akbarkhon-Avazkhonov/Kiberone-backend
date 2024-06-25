import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { PrismaService } from '../prisma.service';

@Injectable()
export class StudentServiceAdmin {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const students = await this.prisma.student.findMany({
      select: {
        id: true,
        name: true,
        age: true,
        login: true,
        password: true,
        isActive: true,
        groupId: true,
        parentId: true,
        kiberonesAmount: true,
        group: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
        parent: {
          select: {
            id: true,
            name: true,
            login: true,
            password: true,
          },
        },
      },
    });
    // sum of students in group by groupId

    return students;
  }

  async create(body: CreateStudentDto) {
    // Найти родителя по логину
    const parent = await this.prisma.parent.findUnique({
      where: { login: body.login },
    });

    // Если родитель найден, выбросить ошибку, так как login должен быть уникальным
    if (parent) {
      throw new HttpException(
        'Login already exists in parent',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Если родитель не найден, создаем студента
    const student = await this.prisma.student.create({
      data: {
        ...body,
        parentId: parent ? parent.id : null, // Установить parentId, если родитель найден
      },
    });

    return student;
  }

  async findStudentById(id: number) {
    try {
      const student = await this.prisma.student.findUnique({
        where: {
          id: id,
        },
        select: {
          id: true,
          name: true,
          age: true,
          login: true,
          password: true,
          isActive: true,
          groupId: true,
          parentId: true,
          group: {
            select: {
              id: true,
              name: true,
              description: true,
              courators: {
                select: {
                  couratorId: true,
                },
              },
              homework: {
                select: {
                  id: true,
                  title: true,
                  deadline: true,
                },
              },
            },
          },
          _count: {
            select: {
              kiberones: true,
            },
          },
        },
      });
      return student;
    } catch (error) {
      throw new HttpException(
        'Failed to update student',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async updateStudent(body: UpdateStudentDto) {
    try {
      const student = await this.prisma.student.update({
        where: {
          id: +body.id,
        },
        data: {
          ...body,
        },
      });
      return student;
    } catch (error) {
      throw new HttpException(
        'Failed to update student',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async updateMe(body: UpdateStudentDto) {
    try {
      const student = await this.prisma.student.update({
        where: {
          id: +body.id,
        },
        data: {
          ...body,
        },
      });
      return student;
    } catch (error) {
      throw new HttpException(
        'Failed to update student',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async remove(id: number) {
    try {
      const student = await this.prisma.student.delete({
        where: {
          id: id,
        },
      });
      return student;
    } catch (error) {
      throw new HttpException(
        'Failed to delete student',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
