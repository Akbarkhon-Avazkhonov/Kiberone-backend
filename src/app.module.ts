import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StudentModule } from './student/student.module';
import { CouratorModule } from './courator/courator.module';
import { GroupModule } from './group/group.module';
import { KiberoneModule } from './kiberone/kiberone.module';
import { PrismaService } from './prisma.service';
import { TestsModule } from './tests/tests.module';
import { LoginModule } from './login/login.module';
import { LoginCouratorModule } from './login-courator/login-courator.module';
import { ParentModule } from './parent/parent.module';
import { HomeworkModule } from './homework/homework.module';
import { AdminModule } from './admin/admin.module';
// import { ServeStaticModule } from '@nestjs/serve-static';
// import { join } from 'path';
import { PollsModule } from './polls/polls.module';
import { LimitsModule } from './limits/limits.module';

@Module({
  imports: [
    StudentModule,
    CouratorModule,
    GroupModule,
    KiberoneModule,
    TestsModule,
    LoginModule,
    LoginCouratorModule,
    ParentModule,
    HomeworkModule,
    AdminModule,
    PollsModule,
    LimitsModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
