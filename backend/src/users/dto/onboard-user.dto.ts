import { IsString, IsEmail, IsArray, IsOptional, IsEnum } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class OnboardUserDto {
  @ApiProperty({ example: 'Amara' })
  @IsString()
  firstName: string

  @ApiProperty({ example: 'Okafor' })
  @IsString()
  lastName: string

  @ApiProperty({ example: 'amara@example.com', required: false })
  @IsEmail()
  @IsOptional()
  email?: string

  @ApiProperty({ example: 'Chisom', required: false })
  @IsString()
  @IsOptional()
  middleName?: string

  @ApiProperty({ example: 'secret123', required: false })
  @IsString()
  @IsOptional()
  password?: string

  @ApiProperty({ example: '08012345678' })
  @IsString()
  phone: string

  @ApiProperty({
    example: '12345678901',
    description: '11-digit Bank Verification Number',
  })
  @IsString()
  bvn: string

  @ApiProperty({
    example: '01/01/1990',
    description: 'Date of birth MM/DD/YYYY',
  })
  @IsString()
  dob: string

  @ApiProperty({
    example: '1',
    description: '1 = Male, 2 = Female',
    enum: ['1', '2'],
  })
  @IsEnum(['1', '2'])
  gender: '1' | '2'

  @ApiProperty({ example: '12 Broad Street, Lagos' })
  @IsString()
  address: string

  @ApiProperty({ enum: ['find_jobs', 'hire_services'], required: false })
  @IsEnum(['find_jobs', 'hire_services'])
  @IsOptional()
  role?: 'find_jobs' | 'hire_services'

  @ApiProperty({
    example: 'Amara Electrics',
    required: false,
    description: 'Business name for employers',
  })
  @IsString()
  @IsOptional()
  brandName?: string

  @ApiProperty({ example: 'Lagos' })
  @IsString()
  location: string

  @ApiProperty({ example: ['English', 'Yoruba'], type: [String] })
  @IsArray()
  languages: string[]

  @ApiProperty({
    example:
      'I have 5 years of plumbing experience and also do tiling and general repairs.',
  })
  @IsString()
  skills: string

  @ApiProperty({
    enum: ['beginner', 'intermediate', 'expert'],
    required: false,
  })
  @IsEnum(['beginner', 'intermediate', 'expert'])
  @IsOptional()
  experience?: string

  @ApiProperty({
    enum: ['one_time', 'full_time', 'contract', 'flexible'],
    required: false,
  })
  @IsEnum(['one_time', 'full_time', 'contract', 'flexible'])
  @IsOptional()
  jobType?: string

  @ApiProperty({ enum: ['remote', 'onsite', 'hybrid'], required: false })
  @IsEnum(['remote', 'onsite', 'hybrid'])
  @IsOptional()
  workType?: string

  @ApiProperty({
    example: '10km',
    required: false,
    description: 'Maximum distance willing to travel for work',
  })
  @IsString()
  @IsOptional()
  workDistance?: string
}
