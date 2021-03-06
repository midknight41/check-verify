﻿// Testing Framework
import * as Code from "code";
import * as Lab from "lab";
import getHelper from "lab-testing";
import * as Q from "q";

import { promiser } from "../lib/check-verify";

const lab = exports.lab = Lab.script();
const expect = Code.expect;
const testing = getHelper(lab);

const method = testing.createExperiment("CheckVerify", "promiser");

class MyClass {
  public id: string = "123";
}

method("The check() method", () => {

  let checker = promiser();

  testing.throws.methodParameterTest(checker, checker.check, ["field"], "fieldName");

});

method("The optional() method", () => {

  let checker = promiser();

  testing.throws.methodParameterTest(checker, checker.optional, ["field"], "fieldName");

});


method("verify", () => {

  lab.test("A class as a source does not produce an error", () => {

    const obj = new MyClass();

    return promiser()
      .check("id").is.a.string()
      .verify({ id: "123" });

  });

  lab.test("A simple type will throw an error", () => {

    return promiser()
      .check("id").is.a.string()
      .verify("hi")
      .then(() => {

        Code.fail("success when we didn't expect it");

      })
      .catch(error => {

        expect(error).to.be.an.error();

      });


  });

  lab.test("An null object will throw an error", () => {

    return promiser()
      .check("id").is.a.string()
      .verify(null)
      .then(() => {

        Code.fail("success when we didn't expect it");

      })
      .catch(error => {

        expect(error).to.be.an.error();

      });

  });

  lab.test("An undefined object will throw an error", () => {

    return promiser()
      .check("id").is.a.string()
      .verify(undefined)
      .then(() => {

        Code.fail("success when we didn't expect it");

      })
      .catch(error => {

        expect(error).to.be.an.error();

      });

  });

});

method("optional", () => {

  lab.test("An null object will not reject", () => {

    return promiser()
      .optional("id").is.a.string()
      .verify({ id: null })

      .catch(error => {
        Code.fail(`unexpected error: ${error.message}`);
      });


  });

  lab.test("An undefined object will not reject", () => {

    return promiser()
      .optional("id").is.a.string()
      .verify({ id: undefined })

      .catch(error => {
        Code.fail(`unexpected error: ${error.message}`);
      });


  });

  lab.test("A successful verification will not reject", () => {

    return promiser()
      .optional("id").is.a.string()
      .verify({ id: "a" })

      .catch(error => {
        Code.fail(`unexpected error: ${error.message}`);
      });

  });

  lab.test("A unsuccessful verification will reject", () => {

    return promiser()
      .optional("id").is.a.string()
      .verify({ id: 123 })

      .then(() => {
        Code.fail("success when we didn't expect it");
      })
      .catch(error => {
        expect(error).to.be.an.error();
      });

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

method("is.a.date()", () => {

  const data = generateTestData("date");

  genericTest("date", "not a date", data.goodValue, data.bad);

});


function generateTestData(goodName: string) {

  const items = [{ name: "boolean", value: true },
  { name: "number", value: 123 },
  { name: "string", value: "abc" },
  { name: "object", value: {} },
  { name: "array", value: ["a"] },
  { name: "function", value: function () { return; } },
  { name: "date", value: new Date() }];

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

  lab.test(`A successful ${type} test does not produce an error`, () => {

    const source = {};

    source[fieldName] = goodData;

    return promiser()
      .check(fieldName).is.a[type]()
      .verify(source);

  });

  for (const badItem of badData) {

    lab.test(`A ${type} check will fail on a ${badItem.name} value`, () => {

      const source = {};
      source[fieldName] = badItem.value;

      return promiser()
        .check(fieldName).is.a[type]()
        .verify(source)
        .then(() => {
          Code.fail("success when we didn't expect it");
        })
        .catch(error => {

          expect(error).to.be.an.error();
          expect(error.message).to.contain([`"${fieldName}"`, errorText]);

          return Q.resolve(null);
        });


    });

  }

  lab.test(`A ${type} check will fail on a null value`, () => {

    const source = {};
    source[fieldName] = null;

    return promiser()
      .check(fieldName).is.a[type]()
      .verify(source)
      .then(() => {
        Code.fail("success when we didn't expect it");
      })
      .catch(error => {

        expect(error).to.be.an.error();
        expect(error.message).to.contain([`"${fieldName}"`, errorText]);

        return Q.resolve(null);
      });

  });

  lab.test(`A ${type} check will fail on an undefined value`, () => {

    const source = {};
    source[fieldName] = undefined;

    return promiser()
      .check(fieldName).is.a[type]()
      .verify(source)
      .then(() => {
        Code.fail("success when we didn't expect it");
      })
      .catch(error => {

        expect(error).to.be.an.error();
        expect(error.message).to.contain([`"${fieldName}"`, errorText]);

        return Q.resolve(null);
      });

  });

}
