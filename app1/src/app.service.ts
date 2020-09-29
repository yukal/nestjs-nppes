import * as querystring from 'querystring';
import { AxiosResponse } from 'axios';
import { Injectable, Inject, HttpService, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { T_NPPESSearchDto } from './nppes/dto/nppes-search';

@Injectable()
export class AppService {
  logger: Logger;

  private readonly API_VERSION = '2.1';
  private readonly API_URL: string = 'https://npiregistry.cms.hhs.gov/api';

  // Set the max depth of limit and skip results
  // See: https://npiregistry.cms.hhs.gov/api/demo?version=2.1
  private readonly API_MAX_LIMIT_RESULTS: number = 200;
  private readonly API_MAX_SKIP_RESULTS: number = 1000;

  constructor(
    private httpService: HttpService,
    @Inject('MY_MICRO_SERVICE') private client: ClientProxy,
  ) {
    this.logger = new Logger('AppService');
  }

  async search(nppesParams: T_NPPESSearchDto): Promise<AxiosResponse> {
    if (!nppesParams.hasOwnProperty('version')) {
      nppesParams.version = '2.1';
    }

    const queryPath = this.API_URL + '/?' + querystring.stringify(nppesParams);
    const options = {
      headers: {
        'Accept': 'application/json'
      }
    };

    return this.httpService.get(queryPath, options)
      .toPromise()
      .then(resp => resp.data)
      .catch(err => err);
  }

  async msImport(nppesParams: T_NPPESSearchDto): Promise<void> {
    this.logger.log('Start import process');
    this.client.send('import', nppesParams)
      .subscribe(res => this.logger.log(res));
  }

  private async onApplicationBootstrap() {
    await this.client.connect();
  }
}
