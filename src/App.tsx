import * as React from 'react';
import { Breadcrumb } from './Breadcrumb';
import { Tabs } from './Tabs';

export default function App() {
  return (
    <Tabs>
      <Tabs.List>
        <Tabs.Tab id="tab1">
          <span>tab1</span>
        </Tabs.Tab>
        <Tabs.Tab id="tab2">
          <span>tab2</span>
        </Tabs.Tab>
      </Tabs.List>
        <Tabs.Panel id="tab1">content1</Tabs.Panel>
        <Tabs.Panel id="tab2">content2</Tabs.Panel>
    </Tabs>
  );
}
