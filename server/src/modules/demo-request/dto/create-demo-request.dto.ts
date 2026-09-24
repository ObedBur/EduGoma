import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';

export const STUDENT_RANGES = ['moins-de-100', '100-300', '300-600', 'plus-de-600'] as const;

export type StudentRange = (typeof STUDENT_RANGES)[number];

export class CreateDemoRequestDto {
  @IsString()
  @IsNotEmpty({ message: 'Le nom du contact est obligatoire.' })
  @MaxLength(120)
  contactName: string;

  @IsString()
  @IsNotEmpty({ message: "Le nom de l'établissement est obligatoire." })
  @MaxLength(120)
  schoolName: string;

  /** Format RDC : +243XXXXXXXXX ou 0XXXXXXXXX */
  @IsString()
  @IsNotEmpty({ message: 'Le numéro de téléphone est obligatoire.' })
  @Matches(/^(\+243|0)[0-9]{9}$/, {
    message: 'Le numéro doit être au format RDC (+243XXXXXXXXX ou 0XXXXXXXXX).',
  })
  phone: string;

  @IsOptional()
  @IsEmail({}, { message: 'Adresse email invalide.' })
  @MaxLength(120)
  email?: string;

  @IsOptional()
  @IsIn(STUDENT_RANGES, {
    message: `La tranche doit être l'une des valeurs suivantes : ${STUDENT_RANGES.join(', ')}.`,
  })
  studentRange?: StudentRange;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  message?: string;
}
