import React, { FC, useMemo, useState } from 'react';

export const useTabState = () => {
  const [tabs, setTabs] = React.useState<(HTMLButtonElement | string)[]>([]);
  const [contents, setContents] = React.useState<HTMLDivElement[]>([]);
  const registerTab = React.useCallback((tab: HTMLButtonElement) => {
    setTabs((tabs) => [tab, ...tabs]);
  }, []);
  const registerContent = React.useCallback((content: HTMLDivElement) => {
    setContents((contents) => [content, ...contents]);
  }, []);
  const [activeTab, setActiveTab] = useState<
    undefined | string | HTMLButtonElement
  >(undefined);

  const getIsActiveTab = React.useCallback(
    (tab: HTMLButtonElement) => {
      return activeTab === tab;
    },
    [activeTab]
  );
  const getIsActiveContent = React.useCallback(
    (content: HTMLDivElement) => {
      const activeTabIndex = tabs.findIndex((tab) => tab === activeTab);
      const contentIndex = contents.findIndex(
        (currContent) => currContent === content
      );

      if (activeTabIndex < 0 || contentIndex < 0) {
        return false;
      }

      return contentIndex === activeTabIndex;
    },
    [activeTab, contents, tabs]
  );

  return useMemo(
    () => ({
      activeTab,
      setActiveTab,
      registerTab,
      registerContent,
      getIsActiveContent,
      getIsActiveTab,
    }),
    [
      activeTab,
      registerTab,
      registerContent,
      getIsActiveContent,
      getIsActiveTab,
    ]
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
  registerContent,
  getIsActiveContent,
  activeTab,
  setActiveTab,
  registerTab,
  getIsActiveTab,
  ...rest
}) => {
  const contentRef = React.useRef<HTMLDivElement>(null);

  const isActive = contentRef.current
    ? getIsActiveContent(contentRef.current)
    : false;

  React.useEffect(() => {
    if (contentRef.current !== null) {
      registerContent(contentRef.current);
    }
  }, [registerContent]);

  return (
    <div {...rest} ref={contentRef} id={id}>
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
  const isActive = buttonRef.current
    ? getIsActiveTab(buttonRef.current)
    : false;

  React.useEffect(() => {
    if (buttonRef.current !== null) {
      registerTab(buttonRef.current);
    }
  }, [registerTab]);

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
          setActiveTab(buttonRef.current);
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
