export type Fn<A, B> = (a: A) => B;

export const pipe = <A, B, C>(
  ab: Fn<A, B>,
  bc: Fn<B, C>,
): Fn<A, C> =>
    (a: A) => bc(ab(a));

export type PipeableFn<A, B> = Fn<A, B> & {
  pipe: <C>(fn: Fn<B, C>) => PipeableFn<A, C>,
}

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
