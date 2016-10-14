declare module "lab" {

  function script(): Lab;
  
  interface Lab {
    describe(label: string, callback: () => void);
    test: LabTest;
    experiment(label: string, callback: (options?: Options) => void);
    beforeEach(callback: (done: Function) => void);
    before(callback: (done: Function) => void);
    afterEach(callback: (done: Function) => void);
    after(callback: (done: Function) => void);
  }

  interface LabTest {
    only(label: string, callback: (done: DoneCallback, options?: Options) => void);
    skip(label: string, callback: (done: DoneCallback, options?: Options) => void);
    (label: string, callback: (done: DoneCallback, options?: Options) => void);
  }

  interface DoneCallback {
    ();
    note(note: string);
  }

  interface Options {
    timeout: number;
    parallel: number;
    skip: boolean;
    only: boolean;
  }
}