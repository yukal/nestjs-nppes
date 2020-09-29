import * as Fs from 'fs';
import { Body, Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AppService } from './app.service';
import { T_NPPESSearchDto } from './nppes/dto/nppes-search';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern('import')
  async import(@Body() nppesParams: T_NPPESSearchDto): Promise<string|Error> {
    const fileName = process.cwd() + '/data/us_cities.json';
    let cities = {};

    try {
      const data = await Fs.promises.readFile(fileName, { encoding: 'utf-8' });
      cities = JSON.parse(data);
    } catch(err) {
      this.appService.logger.log(err.toString());
      return err;
    }

    this.appService.logger.log('Start import process');
    const states = Object.keys(cities);

    if (!nppesParams.hasOwnProperty('version')) {
      nppesParams.version = this.appService.API_VERSION;
    }

    if (!nppesParams.hasOwnProperty('limit')) {
      nppesParams.limit = this.appService.API_MAX_LIMIT_RESULTS;
    }

    nppesParams.skip = 0;
    nppesParams.country_code = 'US';

    const self = this;

    return new Promise((resolve, reject) => {
      self.appService.importBatch(states, cities, nppesParams, (err: Error) => {
        err ? reject(err) : resolve('Finish import process');
      });
    })
  }
}
