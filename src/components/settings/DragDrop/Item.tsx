
type ItemProps = {
  id: string | null;
};

export const Item = ({ id }: ItemProps) => {
  return (
    <>
      <div>Item {id}</div>
      <div>C!</div>
    </>
  );
};
