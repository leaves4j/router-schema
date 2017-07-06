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
  handler: (...args: Array<any>) => ValidateData;
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
// export interface IRouter {
//   [x: string]: (path: string, ...handler: (...any) => Promise<void> | void) => void
// }
export type IRouter = any;

export interface IValidator {
  constructor(schema: Object, joiOption: Object): void;
  validate(requestData: Object): ValidateResult;
}

export interface IRequestHandler {
  constructor(convert: Convert, validator: IValidator): void;
  handler(...args: Array<any>): Promise<void> | void;
}

export interface IRouterSchema {
  router: IRouter;
  constructor(router: IRouter, options: RouterSchemaOption): void;
  loadSchema(schema: SchemaOption): IRouter;
  handler(): ValidateData;
  static SchemaParser(schemaOption: SchemaOption): Array<RouterSchemaObject>;
}
