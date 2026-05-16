import { Injectable } from '@nestjs/common'
import { SquadService } from '../squad/squad.service'
import { PrismaService } from '../prisma/prisma.service'
import { OnboardUserDto } from './dto/onboard-user.dto'

@Injectable()
export class UsersService {
  constructor(
    private readonly squadService: SquadService,
    private readonly prisma: PrismaService,
  ) {}

  async onboard(dto: OnboardUserDto) {
    const squadAccount = await this.squadService.createVirtualAccount({
      firstName: dto.firstName,
      lastName: dto.lastName,
      middleName: dto.middleName,
      email: dto.email,
      phone: dto.phone,
      bvn: dto.bvn,
      dob: dto.dob,
      gender: dto.gender,
      address: dto.address,
    })

    if (!squadAccount?.data) {
      console.error(
        'Squad createVirtualAccount failed or returned no data:',
        squadAccount,
      )
    }
    const va = (squadAccount?.data ?? {}) as Record<string, unknown>
    const user = await this.prisma.user.create({
      data: {
        id: `USR-${Date.now()}`,
        firstName: dto.firstName,
        lastName: dto.lastName,
        email: dto.email,
        phone: dto.phone,
        dob: dto.dob,
        gender: dto.gender,
        address: dto.address,
        role: dto.role,
        brandName: dto.brandName,
        location: dto.location,
        languages: dto.languages,
        skills: dto.skills,
        experience: dto.experience,
        jobType: dto.jobType,
        workType: dto.workType,
        workDistance: dto.workDistance,
        accountNumber: String(va.virtual_account_number ?? ''),
        bankName: String(va.bank_name ?? ''),
        accountName: `${dto.firstName} ${dto.lastName}`,
        trustScore: 0,
      },
    })

    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      role: user.role,
      skills: user.skills,
      languages: user.languages,
      location: user.location,
      experience: user.experience,
      trustScore: user.trustScore,
      createdAt: user.createdAt.toISOString(),
      virtualAccount: {
        accountNumber: user.accountNumber,
        bankName: user.bankName,
        accountName: user.accountName,
      },
    }
  }

  findById(userId: string) {
    return this.prisma.user.findUnique({ where: { id: userId } })
  }
}
