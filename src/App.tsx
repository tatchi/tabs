import * as React from 'react';
import { Tabs, useTabState } from './Tabs';

export default function App() {
  const tab = useTabState();

  return (
    <>
      <div>
        <Tabs.List>
          <Tabs.Tab {...tab}>
            <span>tab1</span>
          </Tabs.Tab>
          <Tabs.Tab {...tab} id="tab2">
            <span>tab2</span>
          </Tabs.Tab>
          <Tabs.Tab {...tab} id="tab3">
            <span>tab3</span>
          </Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel {...tab}>content1</Tabs.Panel>
        <Tabs.Panel {...tab} id="tab2">
          content2
        </Tabs.Panel>
        <Tabs.Panel {...tab} id="tab3">
          content3
        </Tabs.Panel>
      </div>
      <button onClick={() => tab.setActiveTab('tab3')}>setActive</button>
    </>
  );
}
