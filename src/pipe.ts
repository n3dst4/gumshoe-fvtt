/**
 * A pure function of A -> B
 */
export type Fn<A, B> = (a: A) => B;

/**
 * Given two pure functions with compatible out/in types, chaint hem together
 * and return a new function with is the product of the two.
 */
export const pipe = <A, B, C>(
  ab: Fn<A, B>,
  bc: Fn<B, C>,
): Fn<A, C> =>
    (a: A) => bc(ab(a));

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
  const fn = ((a: A) => bc(ab(a))) as PipeableFn<A, C>;
  fn.pipe = function<D> (cd: Fn<C, D>) {
    return chainPipe(fn, cd);
  };
  return fn;
};
