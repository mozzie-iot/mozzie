import React from 'react';

interface Props {
  children: React.ReactNode;
}

const RolesLayout: React.FunctionComponent<Props> = ({ children }) => {
  return (
    <>
      <h1 className="scroll-m-20 text-4xl font-bold tracking-tight">Roles</h1>
      {children}
    </>
  );
};

export default RolesLayout;
