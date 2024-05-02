// This is a repeat of some of the stuff in ReactApplicationMixin, so I can just
// leave that untouched while monkeying with V2 stuff

// type shenanigans to allow us to work backwards from a Class type to the type
// of the objects which it constructs

// a "Constructor of T" is the type of the class T, when used as a value
export type Constructor<T> = new (...args: any[]) => T;

// Render<T> T is a Constructor<T2>. It then expects its actual argument to be
// a T2, i.e. the type of the thing the constructor constructs.
export type Render<T> = (
  t: T extends Constructor<infer T2> ? T2 : T,
  serial: number,
) => JSX.Element;

declare global {}

export type RecursivePartial<T> = T extends () => any
  ? T
  : {
      [P in keyof T]?: RecursivePartial<T[P]>;
    };
