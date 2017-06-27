// @flow

export type ValidateData = {
  data: Object,
  callback(error: null | Object, value: Object | null): any;
}

export type ValidateResult = {
  error: null | Object,
  value: Object | null
}

export type JoiSchemaOption = {
  joiOption: Object,
  handler: (...args: any) => ValidateData;
}

export type SchemaOption = {
  [string]: Object
}

export type RouterSchema = {
  method: string,
  path: string,
  schema: Object
}

export type Convert = () => ValidateData;

export interface IValidator {
  constructor(schema: Object, joiOption: Object): void;
  validate(requestData: Object): ValidateResult;
}

export interface IRequestHandler {
  constructor(convert: Convert, validator: IValidator): void;
  handler(...args: any): Promise<void>;
}

export interface IJoiSchema {
  constructor(options: JoiSchemaOption): void;
  loadSchema(routerInstance: any, schema: SchemaOption): any;
  handler(): ValidateData;
  static SchemaParser(schemaOption: SchemaOption): Array<RouterSchema>;
}
