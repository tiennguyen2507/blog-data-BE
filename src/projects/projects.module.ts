import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { DatabaseModule } from '../database/database.module';
import { projectProviders } from '../providers/project.providers';
import { usersProviders } from '../providers/user.providers';

@Module({
  imports: [DatabaseModule],
  controllers: [ProjectsController],
  providers: [ProjectsService, ...projectProviders, ...usersProviders],
})
export class ProjectsModule {}
