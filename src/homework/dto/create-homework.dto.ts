export class CreateHomeworkDto {
  title: string;
  deadline: Date;
  groupId: number;
  files: string[];
}
