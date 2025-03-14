import React from 'react';

type PropsType = Readonly<{
  children: React.ReactNode;
}>;

const MainContent = ({ children }: PropsType) => {
  return <div style={{ maxWidth: '660px', padding: '24px' }}>{children}</div>;
};

export default MainContent;
