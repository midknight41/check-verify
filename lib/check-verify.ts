import * as Q from "q";
import * as urlMod from "url";

export enum Modes {
  PromiseMode = 1,
  ThrowMode = 2
}

export function thrower() {
  return new CheckVerify<void>(Modes.ThrowMode);
}

export function promiser() {
  return new CheckVerify<Q.Promise>(Modes.PromiseMode);
}

// promiser()
//  .check("itemId").is.a.string()
//  .check("itemName").is.a.string()
//  .verify({ itemId, itemName });

// thrower()
//  .check("item.id").is.a.string()
//  .check("item.name").is.a.string()
//  .check("item.tests").is.an.array()
//  .verify({ id: "a", name: "b" });


// const check = thrower();

// check("item.id").is.a.string()
// check("item.name").is.a.string()
// check("item.tests").is.an.array()

// check.verify({ id: "a", name: "b" });

export class CheckVerify<T> {

  private mode: Modes;
  private currentCheck = null;
  private checks: any[] = [];
  private finalised: boolean = false;

  constructor(mode: Modes) {
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

    this.checkStarted_();
    this.currentCheck.tests.push("array");

    return this;
  }

  public object(): CheckVerify<T> {
    this.checkStarted_();
    this.currentCheck.tests.push("object");

    return this;
  }

  public function(): CheckVerify<T> {
    this.checkStarted_();
    this.currentCheck.tests.push("function");

    return this;
  }

  public number(): CheckVerify<T> {
    this.checkStarted_();
    this.currentCheck.tests.push("number");

    return this;
  }
  public boolean(): CheckVerify<T> {
    this.checkStarted_();
    this.currentCheck.tests.push("boolean");

    return this;
  }
  public string(): CheckVerify<T> {
    this.checkStarted_();
    this.currentCheck.tests.push("string");

    return this;
  }

  public url(): CheckVerify<T> {
    this.checkStarted_();
    this.currentCheck.tests.push("url");

    return this;
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

      for (const test of item.tests) {

        const error = this[`${test}Test_`](source[item.field], item.field);

        if (error !== null) {
          return error;

        }
      }
    }

  }

  get a() { return this; };
  get an() { return this; };
  get that() { return this; };
  get is() { return this; };




  private objectTest_(object: Object, name?: string): Error {
    if (object === null || object === undefined || typeof object !== "object" || Array.isArray(object) === true) return this.generateError(name, "an object");
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
