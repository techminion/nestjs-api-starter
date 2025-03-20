import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Response } from 'express';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface ApiResponse<T> {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, ApiResponse<T>> {
  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<ApiResponse<T>> {
    return next.handle().pipe(
      map((data: unknown): ApiResponse<T> => {
        const response: Response = context.switchToHttp().getResponse<Response>();

        const isObject: boolean = typeof data === 'object' && data !== null;
        const message: string =
          isObject && 'message' in (data as Record<string, unknown>)
            ? ((data as Record<string, unknown>).message as string)
            : 'Request successful';

        const responseData: T =
          isObject && 'data' in (data as Record<string, unknown>)
            ? ((data as Record<string, unknown>).data as T)
            : (data as T);

        return {
          statusCode: response.statusCode || 200,
          success: true,
          message,
          data: responseData,
        };
      }),
    );
  }
}
