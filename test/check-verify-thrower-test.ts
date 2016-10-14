// Testing Framework
import * as Code from "code";
import * as Lab from "lab";
import getHelper from "./helpers/TestHelper";

import { thrower } from "../lib/check-verify";

const lab = exports.lab = Lab.script();
const expect = Code.expect;
const helper = getHelper(lab);

const method = helper.createExperiment("CheckVerify", "thrower");

class MyClass {
  public id: string = "123";
}

method("verify", () => {

  lab.test("A class as a source does not produce an error", done => {

    const obj = new MyClass();

    thrower()
      .check("id").is.a.string()
      .verify({ id: "123" });

    done();

  });

  lab.test("A simple type will throw an error", done => {

    try {
      thrower()
        .check("id").is.a.string()
        .verify("hi");

    } catch (error) {
      expect(error).to.be.an.error();
      return done();
    }

    Code.fail("success when we didn't expect it");


  });

  lab.test("An null object will throw an error", done => {

    try {
      thrower()
        .check("id").is.a.string()
        .verify(null);

    } catch (error) {
      expect(error).to.be.an.error();
      return done();
    }

    Code.fail("success when we didn't expect it");

  });

  lab.test("An undefined object will throw an error", done => {

    try {
      thrower()
        .check("id").is.a.string()
        .verify(undefined);

    } catch (error) {
      expect(error).to.be.an.error();
      return done();
    }

    Code.fail("success when we didn't expect it");
  });

});

method("is.a.string()", () => {

  const data = generateTestData("string");

  genericTest("string", "not a populated string", data.goodValue, data.bad);

});

method("is.a.number()", () => {

  const data = generateTestData("number");

  genericTest("number", "not a number", data.goodValue, data.bad);

});

method("is.an.object()", () => {


  const data = generateTestData("object");

  genericTest("object", "not an object", data.goodValue, data.bad);

});

method("is.an.array()", () => {

  const data = generateTestData("array");

  genericTest("array", "not an array", data.goodValue, data.bad);

});

method("is.a.boolean()", () => {

  const data = generateTestData("boolean");

  genericTest("boolean", "not a boolean", data.goodValue, data.bad);


});

method("is.a.function()", () => {

  const data = generateTestData("function");

  genericTest("function", "not a function", data.goodValue, data.bad);

});

method("is.a.url()", () => {

  const data = generateTestData("url");

  genericTest("url", "not a url", "http://www.there.com", data.bad);

});

function generateTestData(goodName: string) {

  const items = [{ name: "boolean", value: true },
  { name: "number", value: 123 },
  { name: "string", value: "abc" },
  { name: "object", value: {} },
  { name: "array", value: ["a"] },
  { name: "function", value: function () { return; } }
  ];

  let goodValue;

  const badItems = items.filter(item => {
    if (item.name !== goodName) {
      return true;
    }

    goodValue = item.value;
    return false;

  });

  return {
    goodValue: goodValue,
    bad: badItems
  };

}

function genericTest(type, errorText, goodData, badData) {

  const fieldName = "field1";

  lab.test(`A successful ${type} test does not produce an error`, done => {

    const source = {};

    source[fieldName] = goodData;

    thrower()
      .check(fieldName).is.a[type]()
      .verify(source);

    done();

  });

  for (const badItem of badData) {

    lab.test(`A ${type} check will fail on a ${badItem.name} value`, done => {

      const source = {};
      source[fieldName] = badItem.value;

      try {
        thrower()
          .check(fieldName).is.a[type]()
          .verify(source);

      } catch (error) {

        expect(error).to.be.an.error();
        expect(error.message).to.contain([`"${fieldName}"`, errorText]);

        return done();
      }

      Code.fail("success when we didn't expect it");
    });

  }

  lab.test(`A ${type} check will fail on a null value`, done => {

    const source = {};
    source[fieldName] = null;

    try {
      thrower()
        .check(fieldName).is.a[type]()
        .verify(source);

    } catch (error) {

      expect(error).to.be.an.error();
      expect(error.message).to.contain([`"${fieldName}"`, errorText]);

      return done();
    }

    Code.fail("success when we didn't expect it");
  });

  lab.test(`A ${type} check will fail on an undefined value`, done => {

    const source = {};
    source[fieldName] = undefined;

    try {
      thrower()
        .check(fieldName).is.a[type]()
        .verify(source);

    } catch (error) {

      expect(error).to.be.an.error();
      expect(error.message).to.contain([`"${fieldName}"`, errorText]);

      return done();
    }

    Code.fail("success when we didn't expect it");
  });

}
