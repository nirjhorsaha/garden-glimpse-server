// TErrorSources defines the structure for individual error details, including the specific path and error message.
// TGenericErrorResponse defines the structure for a standardized error response, including the status code, overall message, and details of specific errors.

export type TErrorSources = {
  path: string | number;
  message: string;
}[];

export type TGenericErrorResponse = {
  statusCode: number;
  message: string;
  errorSources: TErrorSources;
};
