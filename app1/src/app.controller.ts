import { AxiosResponse } from 'axios';
import { Controller, Get, Query } from '@nestjs/common';
import { T_NPPESSearchDto } from './nppes/dto/nppes-search';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
  ) {}

  @Get()
  getHello(): string {
    return 'It Works!';
  }

  @Get('search')
  async search(@Query() params: T_NPPESSearchDto): Promise<AxiosResponse> {
    return this.appService.search(params);
  }

  @Get('import')
  async callMsImport(@Query() params: T_NPPESSearchDto): Promise<string> {
    this.appService.msImport(params);
    return 'Started at ' + new Date().toISOString();
  }
}
