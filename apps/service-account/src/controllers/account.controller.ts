import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Protected, Public } from '@org/auth';
import { ApiOkPaginatedResponse, PaginatedQueryOptions } from '@org/repository';

import { CreateAccountDto } from '../dto/create-account.dto';
import { UpdateAccountDto } from '../dto/update-account.dto';
import { Account } from '../entities/account.entity';
import { AccountService } from '../services/account.service';

@Controller('accounts')
@ApiTags('accounts')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post()
  @ApiOkResponse({ type: Account })
  @Public()
  async create(@Body() createAccountDto: CreateAccountDto) {
    return this.accountService.create(createAccountDto);
  }

  @Get()
  @ApiOkPaginatedResponse({ type: Account })
  @Protected()
  async findAll(@Query() query: PaginatedQueryOptions<Account>) {
    return this.accountService.findAll(query);
  }

  @Get(':id')
  @ApiOkResponse({ type: Account })
  @Protected()
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.accountService.findOne(id);
  }

  @Patch(':id')
  @ApiOkResponse({ type: Account })
  @Protected()
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateAccountDto: UpdateAccountDto
  ) {
    return this.accountService.update(id, updateAccountDto);
  }

  @Patch(':id/activate')
  @Protected()
  async activate(@Param('id', ParseUUIDPipe) id: string) {
    return this.accountService.activate(id);
  }

  @Patch(':id/deactivate')
  @Protected()
  async deactivate(@Param('id', ParseUUIDPipe) id: string) {
    return this.accountService.deactivate(id);
  }

  @Delete(':id')
  @Protected()
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.accountService.remove(id);
  }
}
