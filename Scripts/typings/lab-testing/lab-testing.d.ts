/// <reference path="../lab/lab.d.ts"/>

declare module "lab-testing" {

  export class TestHelper {
    public throws: ParameterTesting;
    public rejects: ParameterTesting;
    createExperiment(service: string, component: string): Function;
    standardContructorTest(Class: any, labels: string[], ...params: any[]): void;
    functionParameterTest(fnc: Function, labels: string[], ...params): void;
    methodParameterTest(self: Object, fnc: Function, labels: string[], ...params): void;
  }

  export class ParameterTesting {
    functionParameterTest(fnc: Function, labels: string[], ...params): void;
    methodParameterTest(self: Object, fnc: Function, labels: string[], ...params): void;
  }


  export default function getHelper(lab: any): TestHelper;

}
