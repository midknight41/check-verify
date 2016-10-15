// Testing Framework
import * as Code from "code";
import * as Lab from "lab";
import getHelper from "./helpers/TestHelper";

import { thrower } from "../lib/check-verify";

const lab = exports.lab = Lab.script();
const expect = Code.expect;
const helper = getHelper(lab);

const method = helper.createExperiment("CheckVerify", "grammar");

class MyClass {
  public id: string = "123";
}

method("all grammar", () => {

  lab.test("A thrower with no source provided does not execute immediately when a test is called", done => {

    const obj = { id: 123 };

    thrower()
      .check("id").that.is.an.a.string();

    return done();

  });

});
