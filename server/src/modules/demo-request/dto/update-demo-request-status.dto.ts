import { IsIn, IsNotEmpty, IsString } from 'class-validator';

export const DEMO_REQUEST_STATUSES = [
  'nouveau',
  'contacté',
  'converti',
  'clôturé',
] as const;

export type DemoRequestStatus = (typeof DEMO_REQUEST_STATUSES)[number];

export class UpdateDemoRequestStatusDto {
  @IsString()
  @IsNotEmpty({ message: 'Le statut est obligatoire.' })
  @IsIn(DEMO_REQUEST_STATUSES, {
    message: `Le statut doit être l'un des suivants : ${DEMO_REQUEST_STATUSES.join(', ')}`,
  })
  status: DemoRequestStatus;
}
