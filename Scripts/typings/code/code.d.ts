declare module "code" {

  const expect: (target: any, prefix?: string) => Expect;
  const fail: (message: string) => void;

  interface Expect {

    //Grammar
    to: Expect;
    a: Expect;
    an: Expect;
    and: Expect;
    at: Expect;
    be: Expect;
    have: Expect;
    in: Expect;

    // Flags
    not: Expect;
    once: Expect;
    only: Expect;
    part: Expect;
    shallow: Expect;

    // Types
    arguments(): Expect;
    array(): Expect;
    boolean(): Expect;
    buffer(): Expect;
    date(): Expect;
    error(type?: any, msg?: string): Expect;
    function(): Expect;
    number(): Expect;
    regexp(): Expect;
    string(): Expect;
    object(): Expect;

    // Values
    true(): Expect;
    false(): Expect;
    null(): Expect;
    undefined(): Expect;

    // Other
    include(values): Expect;
    includes(values): Expect;
    contain(values): Expect;
    contains(values): Expect;
    startWith(value: string): Expect;
    startsWith(value: string): Expect;
    endWith(value: string): Expect;
    endsWith(value: string): Expect;
    exist(): Expect;
    exists(): Expect;
    empty(): Expect;
    equal(value: any): Expect;
    length(size: number): Expect;
    equal(value, options?): Expect;
    equals(value, options?): Expect;
    above(value: number): Expect;
    greaterThan(value: number): Expect;
    least(value: number): Expect;
    min(value: number): Expect;
    below(value: number): Expect;
    lessThan(value: number): Expect;
    most(value: number): Expect;
    max(value: number): Expect;
    within(from: number, to: number): Expect;
    range(from: number, to: number): Expect;
    between(from: number, to: number): Expect;
    about(value: number, delta: number): Expect;
    instanceof(type): Expect;
    instanceOf(type): Expect;
    match(regex: RegExp): Expect;
    matches(regex: RegExp): Expect;
    satisfy(validator: (value) => boolean): Expect;
    satisfies(validator: (value) => boolean): Expect;
    throw(type?: any, msg?: string): Expect;
    throws(type?: any, msg?: string): Expect;

    fail(message: string): Expect;
    count(): Expect;
    incomplete(): Expect;
    thrownAt(error?: Error): Expect;

  }


}