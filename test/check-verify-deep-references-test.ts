// Testing Framework
import * as Code from "code";
import * as Lab from "lab";
import getHelper from "lab-testing";

import { thrower } from "../lib/check-verify";

const lab = exports.lab = Lab.script();
const expect = Code.expect;
const helper = getHelper(lab);

const method = helper.createExperiment("CheckVerify", "DeepReferences");

method("verify", () => {

  lab.test("validates an attribute from an object successfully", done => {

    const params = { item: { "id": "123", "first": "john", "last": "doe" } };

    thrower()
      .check("item.id").is.a.string()
      .check("item.first").is.a.string()
      .check("item.last").is.a.string()
      .verify(params);

    return done();

  });

  lab.test("fails validation of an attribute from an object", done => {

    const params = { item: { "id": 123, "first": "john", "last": "doe" } };

    try {

      thrower()
        .check("item.id").is.a.string()
        .check("item.first").is.a.string()
        .check("item.last").is.a.string()
        .verify(params);

    } catch (error) {

      expect(error).to.be.an.error();
      expect(error.message).to.contain([`"item.id"`]);

      return done();

    }

    Code.fail("unexpected success");

  });

});
