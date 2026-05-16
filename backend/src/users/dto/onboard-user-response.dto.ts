import { ApiProperty } from '@nestjs/swagger'

class VirtualAccountDto {
  @ApiProperty({ example: '0123456789' })
  accountNumber: string | null

  @ApiProperty({ example: 'Squad MFB' })
  bankName: string | null

  @ApiProperty({ example: 'Amara Okafor' })
  accountName: string | null
}

export class OnboardUserResponseDto {
  @ApiProperty({ example: 'USR-1684156800000' })
  id: string

  @ApiProperty({ example: 'Amara' })
  firstName: string

  @ApiProperty({ example: 'Okafor' })
  lastName: string

  @ApiProperty({ example: 'amara@example.com', required: false })
  email?: string | null

  @ApiProperty({ example: '08012345678' })
  phone: string

  @ApiProperty({ enum: ['find_jobs', 'hire_services'], required: false })
  role?: string | null

  @ApiProperty({
    example:
      'I have 5 years of plumbing experience and also do tiling and general repairs.',
  })
  skills: string

  @ApiProperty({ example: ['English', 'Yoruba'], type: [String] })
  languages: string[]

  @ApiProperty({ example: 'Lagos' })
  location: string

  @ApiProperty({
    enum: ['beginner', 'intermediate', 'expert'],
    required: false,
  })
  experience?: string | null

  @ApiProperty({ type: VirtualAccountDto })
  virtualAccount: VirtualAccountDto

  @ApiProperty({ example: 0 })
  trustScore: number

  @ApiProperty({ example: '2024-05-16T10:00:00.000Z' })
  createdAt: string
}
