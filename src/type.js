// @flow

export type ValidateData = {
  data: Object,
  callback(error: null | Error, value: Object | null): Promise<void> | void;
}

export type ValidateResult = {
  error: null | Object,
  value: Object | null
}

export type RouterSchemaOption = {
  joiOption: Object,
  handler: (...args: any) => ValidateData;
}

export type SchemaOption = {
  [string]: Object
}

export type RouterSchemaObject = {
  method: string,
  path: string,
  schema: Object
}

export type Convert = () => ValidateData;

// Flow doesn't support call of computed property for method dispatch
export interface IRouter {
  [x: string]: (path: string, ...handler: (...any) => Promise<void> | void) => void
}

export interface IValidator {
  constructor(schema: Object, joiOption: Object): void;
  validate(requestData: Object): ValidateResult;
}

export interface IRequestHandler {
  constructor(convert: Convert, validator: IValidator): void;
  handler(...args: any): Promise<void> | void;
}

export interface IRouterSchema {
  constructor(options: RouterSchemaOption): void;
  loadSchema(routerInstance: any, schema: SchemaOption): *;
  handler(): ValidateData;
  static SchemaParser(schemaOption: SchemaOption): Array<RouterSchemaObject>;
}
