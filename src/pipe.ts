/**
 * A pure function of A -> B
 */
export type Fn<A, B> = (a: A) => B;

/**
 * Given two pure functions with compatible out/in types, chain them together
 * and return a new function which is the product of the two.
 */
export const pipe = <A, B, C>(
  fab: Fn<A, B>,
  fbc: Fn<B, C>,
): Fn<A, C> =>
    (a: A) => fbc(fab(a));

/**
 * A simple function of A -> B which also has callable member `pipe`, which can
 * be used to chain any type-compatible other function, creating a new product
 * function.
 */
export type PipeableFn<A, B> = Fn<A, B> & {
  pipe: <C>(fn: Fn<B, C>) => PipeableFn<A, C>,
}

/**
 * Like `pipe`, but the resulting function also has a `pipe` method so you can
 * chain the pipe calls.
 */
export const chainPipe = <A, B, C>(
  ab: ((a: A) => B),
  bc: ((b: B) => C),
): PipeableFn<A, C> => {
  // using `function` here so we can assign `.pipe` to it
  // see https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-1.html#properties-declarations-on-functions
  // and thanks to https://stackoverflow.com/questions/12766528/build-a-function-object-with-properties-in-typescript
  function fn (a: A) {
    return bc(ab(a));
  }
  fn.pipe = function<D> (cd: Fn<C, D>) {
    return chainPipe(fn, cd);
  };
  return fn;
};
