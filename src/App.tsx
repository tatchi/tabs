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
      {/* <Tabs.Contents> */}
        <Tabs.Content id="tab1">content1</Tabs.Content>
        <Tabs.Content id="tab2">content2</Tabs.Content>
      {/* </Tabs.Contents> */}
    </Tabs>
  );
}
