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
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ApiOkPaginatedResponse, PaginatedQueryOptions } from '@org/repository';
import { AccountService } from './account.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';

import { Account } from '../../entities/account.entity';
import { Public } from '../auth/public.decorator';
import { Protected } from '../auth/protected.decorator';

@Controller('accounts')
@ApiTags('accounts')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post()
  @Public()
  @ApiOkResponse({ type: Account })
  async create(@Body() createAccountDto: CreateAccountDto) {
    return this.accountService.create(createAccountDto);
  }

  @Get()
  @Protected()
  @ApiOkPaginatedResponse({ type: Account })
  async findAll(@Query() query: PaginatedQueryOptions<Account>) {
    return this.accountService.findAll(query);
  }

  @Get(':id')
  @Protected()
  @ApiOkResponse({ type: Account })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.accountService.findOne(id);
  }

  @Patch(':id')
  @Protected()
  @ApiOkResponse({ type: Account })
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
