import React, { FC, useMemo, useState } from 'react';

export const useTabState = ({
  defaultActiveTab,
}: {
  defaultActiveTab?: string | null;
} = {}) => {
  const [tabs, setTabs] = React.useState<(HTMLButtonElement | string)[]>([]);
  const [panels, setPanels] = React.useState<(HTMLDivElement | string)[]>([]);
  const [activeTab, setActiveTab] = useState<
    undefined | null | string | HTMLButtonElement
  >(defaultActiveTab);

  console.log({ tabs, panels });

  const registerTab = React.useCallback(
    (tab: HTMLButtonElement | null) => {
      if (tab == null) {
        return;
      }
      const tabId = tab.id || tab;
      setTabs((tabs) => [tabId, ...tabs]);
      if (activeTab === undefined) {
        setActiveTab((currActiveTab) => {
          if (currActiveTab === undefined) {
            return tabId;
          } else {
            return currActiveTab;
          }
        });
      }
    },
    [activeTab]
  );
  const registerPanel = React.useCallback((panel: HTMLDivElement | null) => {
    if (panel == null) {
      return;
    }
    const panelId = panel.id || panel;
    setPanels((panels) => [panelId, ...panels]);
  }, []);

  const getIsActiveTab = React.useCallback(
    (tab: HTMLButtonElement | null) => {
      if (tab == null) {
        return false;
      }
      const tabId = tab.id || tab;
      return activeTab === tabId;
    },
    [activeTab]
  );
  const getIsActivePanel = React.useCallback(
    (panel: HTMLDivElement | null) => {
      if (panel == null) {
        return false;
      }
      const panelId = panel.id || panel;
      const activeTabIndex = tabs.findIndex((tab) => tab === activeTab);
      const panelIndex = panels.findIndex((currPanel) => currPanel === panelId);

      if (activeTabIndex < 0 || panelIndex < 0) {
        return false;
      }
      return panelIndex === activeTabIndex;
    },
    [activeTab, panels, tabs]
  );

  return useMemo(
    () => ({
      activeTab,
      setActiveTab,
      registerTab,
      registerPanel,
      getIsActivePanel,
      getIsActiveTab,
    }),
    [activeTab, registerTab, registerPanel, getIsActivePanel, getIsActiveTab]
  );
};

type useTabStateReturnValues = ReturnType<typeof useTabState>;

const TabList: FC<React.ComponentProps<'div'>> = ({
  children,
  style,
  ...rest
}) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      ...style,
    }}
    {...rest}
  >
    {children}
  </div>
);

type TabPanelProps = {} & React.ComponentProps<'div'>;

const TabPanel: FC<TabPanelProps & useTabStateReturnValues> = ({
  children,
  id,
  registerPanel,
  getIsActivePanel,
  activeTab,
  setActiveTab,
  registerTab,
  getIsActiveTab,
  ...rest
}) => {
  const panelRef = React.useRef<HTMLDivElement>(null);

  const isActive = getIsActivePanel(panelRef.current);

  React.useEffect(() => {
    if (panelRef.current !== null) {
      registerPanel(panelRef.current);
    }
  }, [id, registerPanel]);

  return (
    <div {...rest} ref={panelRef} id={id}>
      {isActive ? children : null}
    </div>
  );
};

type TabProps = {} & React.ComponentProps<'button'>;

export const Tab: FC<TabProps & useTabStateReturnValues> = ({
  children,
  id,
  style,
  setActiveTab,
  registerTab,
  getIsActiveTab,
  activeTab,
}) => {
  const buttonRef = React.useRef<HTMLButtonElement>(null);

  const isActive = getIsActiveTab(buttonRef.current);

  React.useEffect(() => {
    registerTab(buttonRef.current);
  }, [id, registerTab]);

  return (
    <button
      ref={buttonRef}
      id={id}
      type="button"
      style={{
        border: 'none',
        color: 'inherit',
        fontWeight: isActive ? 'bold' : 'normal',
        borderBottom: isActive ? '2px solid black' : 'none',
        backgroundColor: 'inherit',
        cursor: 'pointer',
        ...style,
      }}
      onClick={() => {
        if (buttonRef.current) {
          if (id) {
            setActiveTab(id);
          } else {
            setActiveTab(buttonRef.current);
          }
        }
      }}
    >
      {children}
    </button>
  );
};

export const Tabs = {
  List: TabList,
  Tab: Tab,
  Panel: TabPanel,
};
Tabs.List = TabList;
Tabs.Tab = Tab;
Tabs.Panel = TabPanel;
