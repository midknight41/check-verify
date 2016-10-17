import * as Q from "q";
import * as urlMod from "url";
import * as mod from "object-mapper";

const objectMapper: any = mod;

export enum Modes {
  PromiseMode = 1,
  ThrowMode = 2
}

export function thrower(source: Object = null) {
  return new CheckVerify<void>(Modes.ThrowMode, source);
}

export function promiser() {
  return new CheckVerify<Q.Promise>(Modes.PromiseMode, null);
}

export class CheckVerify<T> {

  private mode: Modes;
  private currentCheck = null;
  private checks: any[] = [];
  private finalised: boolean = false;
  private fastFailEnabled: boolean = false;
  private source: Object = null;

  constructor(mode: Modes, source: Object) {

    if (source !== null) {

      if (typeof source !== "object" || Array.isArray(source) === true) {

        throw new Error("source data must be an object to validate");

      }

      this.fastFailEnabled = true;
    }

    this.source = source;
    this.mode = mode;
  }

  public check(field: string): CheckVerify<T> {

    this.finaliseChecks_();

    this.currentCheck = { field, tests: [] };
    this.finalised = false;

    return this;
  }

  public verify(source: Object): T {

    this.finaliseChecks_();

    const error = this.execute_(source);

    if (this.mode === Modes.ThrowMode) {

      if (error) {
        throw error;
      }

      return;
    }

    if (this.mode === Modes.PromiseMode) {

      if (error) {
        const rejector: any = Q.reject(error);
        return rejector;
      }

      const resolver: any = Q.resolve(null);
      return resolver;
    }

  }

  public explain() {
    this.finaliseChecks_();

    return this.checks;
  }

  public array(): CheckVerify<T> {

    this.registerAndCheckFastFail_("array");
    return this;
  }

  public object(): CheckVerify<T> {

    this.registerAndCheckFastFail_("object");
    return this;
  }

  public function(): CheckVerify<T> {

    this.registerAndCheckFastFail_("function");
    return this;
  }

  public number(): CheckVerify<T> {

    this.registerAndCheckFastFail_("number");
    return this;

  }

  public boolean(): CheckVerify<T> {

    this.registerAndCheckFastFail_("boolean");
    return this;

  }

  public string(): CheckVerify<T> {

    this.registerAndCheckFastFail_("string");
    return this;

  }

  public url(): CheckVerify<T> {

    this.registerAndCheckFastFail_("url");
    return this;
  }

  public date(): CheckVerify<T> {

    this.registerAndCheckFastFail_("date");
    return this;
  }

  private registerAndCheckFastFail_(type: string) {

    this.checkStarted_();
    this.currentCheck.tests.push(type);

    if (this.fastFailEnabled && this.mode === Modes.ThrowMode) {
      const error = this.runTests_(this.source, this.currentCheck);

      if (error) {
        throw error;
      }
    }
  }

  private finaliseChecks_() {

    if (this.currentCheck !== null && this.finalised !== true) this.checks.push(this.currentCheck);
    this.finalised = true;
  }

  private execute_(source: Object) {

    if (source === null || source === undefined || typeof source !== "object") {

      return new Error("source data must be an object to validate");

    }

    // execute all checks
    for (const item of this.checks) {

      const error = this.runTests_(source, item);

      if (error !== null) {
        return error;
      }

    }

  }

  get a() { return this; };
  get an() { return this; };
  get that() { return this; };
  get is() { return this; };

  private runTests_(source, item) {

    for (const test of item.tests) {

      const value = objectMapper.getKeyValue(source, item.field); // source[item.field];
      const error = this[`${test}Test_`](value, item.field);

      if (error !== null) {
        return error;

      }
    }

    return null;

  }

  private objectTest_(object: Object, name?: string): Error {

    if (object === null || object === undefined || typeof object !== "object" || Array.isArray(object) === true || Object.prototype.toString.call(object) === "[object Date]" ) return this.generateError(name, "an object");
    return null;
  }

  private functionTest_(object: Object, name?: string): Error {
    if (object === null || object === undefined || typeof object !== "function") return this.generateError(name, "a function");
    return null;
  }

  private arrayTest_(object: Object[], name?: string): Error {
    if (object === null || object === undefined || Array.isArray(object) === false) return this.generateError(name, "an array");
    return null;
  }

  private numberTest_(value: number, name?: string): Error {
    if (value === null || value === undefined || typeof value !== "number") return this.generateError(name, "a number");
    return null;
  }

  private stringTest_(value: string, name?: string): Error {
    if (value === null || value === undefined || value.length === 0 || typeof value !== "string") return this.generateError(name, "a populated string");
    return null;
  }

  private booleanTest_(value: boolean, name?: string): Error {
    if (value === null || value === undefined || typeof value !== "boolean") return this.generateError(name, "a boolean");
    return null;
  }

  private urlTest_(value: string, name?: string): Error {

    if (value === null || value === undefined || value.length === 0 || typeof value !== "string" || urlMod.parse(value).protocol === null || urlMod.parse(value).protocol.search(/(http|https):/) !== 0) {
      return this.generateError(name, "a url");
    }

    return null;

  }

  private dateTest_(value: Date, name?: string): Error {
    
    if (value === null || value === undefined || Object.prototype.toString.call(value) !== "[object Date]") {
      return this.generateError(name, "a date");
    }

    return null;
  }

  private checkStarted_() {
    if (this.currentCheck === null) throw new Error("The check method must be called first");
  }

  private generateError(name: string, testName: string) {

    let message = "";

    if (name) {
      message = `the parameter "${name}" is not ${testName}`;
    } else {
      message = `parameter is not ${testName}`;
    }

    return new Error(message);
  }

}
