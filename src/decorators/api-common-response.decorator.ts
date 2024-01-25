import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiServiceUnavailableResponse,
  ApiUnauthorizedResponse,
  ApiProperty,
} from '@nestjs/swagger';

export function ApiCommonResponse() {
  return applyDecorators(
    ApiUnauthorizedResponse({ description: 'Unauthorized', type: ErrorModel }),
    ApiBadRequestResponse({ description: 'Something error in business', type: ErrorModel }),
    ApiServiceUnavailableResponse({ description: 'Service Unavailable', type: ErrorModel }),
    ApiInternalServerErrorResponse({ description: 'Internal server Error', type: ErrorModel }),
    ApiNotFoundResponse({ description: 'Not found', type: ErrorModel }),
  );
}

export class ErrorModel {
  @ApiProperty()
  statusCode: string;

  @ApiProperty()
  message: string;

  @ApiProperty()
  timestamp: string;

  @ApiProperty()
  path: string;
}
