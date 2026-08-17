import { PartialType } from '@nestjs/swagger';
import { CreateNotifiactionDto } from './create-notifiaction.dto';

export class UpdateNotifiactionDto extends PartialType(CreateNotifiactionDto) {}
