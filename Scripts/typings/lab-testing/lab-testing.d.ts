/// <reference path="../lab/lab.d.ts"/>

declare module "lab-testing" {

  export class TestHelper {
    createExperiment(service: string, component: string): Function;
    standardContructorTest(Class: any, labels: string[], ...params: any[]): void;
  }
  export default function getHelper(lab: any): TestHelper;


}
