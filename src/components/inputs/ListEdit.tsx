import React from "react";

type ListEditProps = {
  list: string[],
};

export const ListEdit: React.FC<ListEditProps> = ({
  list,
}) => {
  return (
    <div>
      {
        list.map((s, i) => (<span key={i}>{s}! </span>))
      }
    </div>
  );
};

type ListEditAppProps = {
  list: string[],
  foundryApplication: FormApplication,
};

export const ListEditApp: React.FC<ListEditAppProps> = ({
  list,
  foundryApplication,
}) => {
  return (
    <ListEdit list={list} />
  );
};
