import * as React from 'react';
import { Tabs, useTabState } from './Tabs';

export default function App() {
  const tab = useTabState();
  return (
    <>
      <Tabs.List>
        <Tabs.Tab {...tab}>
          <span>tab1</span>
        </Tabs.Tab>
        <Tabs.Tab {...tab}>
          <span>tab2</span>
        </Tabs.Tab>
      </Tabs.List>
        <Tabs.Panel {...tab}>content1</Tabs.Panel>
        <Tabs.Panel {...tab}>content2</Tabs.Panel>
    </>
  );
}
