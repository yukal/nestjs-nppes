import * as querystring from 'querystring';
import { format } from 'util';
import { AxiosResponse } from 'axios';
import { HttpService, Injectable, Logger } from '@nestjs/common';
import { T_NPPESSearchDto } from './nppes/dto/nppes-search';

@Injectable()
export class AppService {
  logger: Logger;

  readonly API_VERSION = '2.1';
  private readonly API_URL: string = 'https://npiregistry.cms.hhs.gov/api';

  // Set the max depth of limit and skip results
  // See: https://npiregistry.cms.hhs.gov/api/demo?version=2.1
  readonly API_MAX_LIMIT_RESULTS: number = 200;
  readonly API_MAX_SKIP_RESULTS: number = 0;
  // readonly API_MAX_SKIP_RESULTS: number = 1000;

  constructor(private httpService: HttpService) {
    this.logger = new Logger('AppService');
  }

  async importBatch(states: string[], cities: any, params: T_NPPESSearchDto, cbDone): Promise<Error|null> {
    if (!states.length) {
      this.logger.log('Finish import process');
      return cbDone(null);
    }

    params.state = states[0];
    params.city = cities[params.state][0];

    let response: AxiosResponse<any> = null;
    const queryPath = this.API_URL + '/?' + querystring.stringify(params);
    const options = {
      headers: {
        'Accept': 'application/json'
      }
    };

    try {
      response = await this.httpService.get(queryPath, options).toPromise();
    } catch(err) {
      this.logger.log(err.toString());
      return cbDone(err);
    }

    const resultCount = response.data.hasOwnProperty('result_count') 
      ? response.data.result_count : 0;

    if (response.data.hasOwnProperty('Errors')) {

      const errors = JSON.stringify(response.data.Errors);
      this.logger.log('Request Errors: ' + errors);
      return cbDone(new Error(errors));

    } else {

      this.logger.log(format('Received %spcs. %s %s:%d %s',
        this.indentFiller(resultCount, 3),
        params.country_code,
        params.state,
        cities[params.state].length,
        params.city,
        // params.skip,
      ));

    }

    if (resultCount > 0 && params.skip < this.API_MAX_SKIP_RESULTS) {
      params.skip += params.limit;
    } else {
      params.skip = 0;
      if (cities[params.state].length > 1) {
        cities[params.state].shift();
      } else {
        delete cities[params.state];
        states.shift();
      }
    }

    // Make next iteration, caring of Event Loop and context binding
    // (Not sure how to solve it more cleanly, without binding)
    // https://stackoverflow.com/questions/64110311/calling-microservice-from-the-self-context-in-the-nestjs
    setImmediate(this.importBatch.bind(this), states, cities, params, cbDone);
  }

  private indentFiller(val: number|string, expectedLength: number, filler: string = ' ') {
    let data = `${val}`;
    const dataLength = data.length;

    if (dataLength < expectedLength) {
      data = filler.repeat(expectedLength - dataLength) + data;
    }

    return data;
  }
}
