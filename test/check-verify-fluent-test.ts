// Testing Framework
import * as Code from "code";
import * as Lab from "lab";
import getHelper from "lab-testing";

import { thrower } from "../lib/check-verify";

const lab = exports.lab = Lab.script();
const expect = Code.expect;
const helper = getHelper(lab);

const method = helper.createExperiment("CheckVerify", "fluent");

method("check", () => {

  let checker = thrower();

  lab.before(done => {

    checker
      .check("id").is.a.string()
      .check("first").is.a.string()
      .check("last").is.a.string();

    return done();
  });

  lab.test("can correctly assemble multiple checks", done => {

    const result = checker.explain();

    expect(result).to.be.an.array().length(3);

    return done();

  });


  lab.test("The number of checks remains consistent after verification", done => {

    const params = { "id": "123", "first": "john", "last": "doe" };
    checker.verify(params);

    const result = checker.explain();

    expect(result).to.be.an.array().length(3);

    return done();

  });


  lab.test("throws if first check fails", done => {

    const field = "id";
    const params = { "id": true, "first": "john", "last": "doe" };

    validateChain(checker, field, params, done);
  });

  lab.test("throws if middle check fails", done => {

    const field = "first";
    const params = { "id": "123", "first": true, "last": "doe" };

    validateChain(checker, field, params, done);
  });

  lab.test("throws if last check fails", done => {

    const field = "last";
    const params = { "id": "123", "first": "john", "last": true };

    validateChain(checker, field, params, done);
  });

});


function validateChain(checker, field, params, done) {

  try {
    checker.verify(params);

  } catch (error) {

    expect(error).to.be.error();
    expect(error.message).to.contain([`"${field}"`]);

    return done();

  }

  Code.fail("unexpected success");

}
