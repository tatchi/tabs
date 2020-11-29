import React, { FC, useMemo, useState } from 'react';

type PanelType = HTMLDivElement;
type TabType = HTMLButtonElement;

export const useTabState = ({
  defaultActiveTab,
}: {
  defaultActiveTab?: string | null;
} = {}) => {
  const [tabs, setTabs] = React.useState<(TabType | string)[]>([]);
  const [panels, setPanels] = React.useState<(PanelType | string)[]>([]);
  const [activeTab, setActiveTab] = useState<
    undefined | null | string | TabType
  >(defaultActiveTab);

  const registerTab = React.useCallback(
    (tab: TabType | string) => {
      setTabs((tabs) => {
        if (tabs.find((t) => t === tab)) {
          return tabs;
        }
        return [tab, ...tabs];
      });
      if (activeTab === undefined) {
        setActiveTab((currActiveTab) => {
          if (currActiveTab === undefined) {
            return tab;
          } else {
            return currActiveTab;
          }
        });
      }
    },
    [activeTab]
  );
  const registerPanel = React.useCallback((panel: PanelType | string) => {
    setPanels((panels) => [panel, ...panels]);
  }, []);

  const getIsActiveTab = React.useCallback(
    (tab: TabType | string) => {
      return activeTab === tab;
    },
    [activeTab]
  );
  const getIsActivePanel = React.useCallback(
    (panel: PanelType | string) => {
      const activeTabIndex = tabs.findIndex((tab) => tab === activeTab);
      const panelIndex = panels.findIndex((currPanel) => currPanel === panel);

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

type TabPanelProps = React.ComponentProps<'div'>;

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
  const panelRef = React.useRef<PanelType>(null);

  const isActive = React.useMemo(() => {
    if (id) {
      return getIsActivePanel(id);
    } else if (panelRef.current) {
      return getIsActivePanel(panelRef.current);
    }
    return false;
  }, [getIsActivePanel, id]);

  React.useEffect(() => {
    if (id) {
      registerPanel(id);
    } else if (panelRef.current) {
      registerPanel(panelRef.current);
    }
  }, [id, registerPanel]);

  return (
    <div {...rest} ref={panelRef} id={id}>
      {isActive ? children : null}
    </div>
  );
};

type TabProps = React.ComponentProps<'button'>;

export const Tab: FC<TabProps & useTabStateReturnValues> = ({
  children,
  id,
  style,
  setActiveTab,
  registerTab,
  getIsActiveTab,
  activeTab,
}) => {
  const tabRef = React.useRef<TabType>(null);

  const isActive = React.useMemo(() => {
    if (id) {
      return getIsActiveTab(id);
    } else if (tabRef.current) {
      return getIsActiveTab(tabRef.current);
    }
    return false;
  }, [getIsActiveTab, id]);

  React.useEffect(() => {
    if (id) {
      registerTab(id);
    } else if (tabRef.current) {
      registerTab(tabRef.current);
    }
  }, [id, registerTab]);

  return (
    <button
      ref={tabRef}
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
        if (tabRef.current) {
          if (id) {
            setActiveTab(id);
          } else {
            setActiveTab(tabRef.current);
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
