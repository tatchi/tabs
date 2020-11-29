import React, { createContext, FC, useContext, useMemo, useState } from 'react';

const context = createContext<{
  activeTab: string | HTMLButtonElement;
  setActiveTab: React.Dispatch<
    React.SetStateAction<string | HTMLButtonElement>
  >;
  registerTab: (tab: HTMLButtonElement) => void;
  registerContent: (tab: HTMLDivElement) => void;
  getIsActiveTab: (tab: HTMLButtonElement) => boolean;
  getIsActiveContent: (content: HTMLDivElement) => void;
}>({
  activeTab: '',
  setActiveTab: () => null,
  registerTab: () => null,
  registerContent: () => null,
  getIsActiveTab: () => false,
  getIsActiveContent: () => false,
});

const TabsProvider = context.Provider;

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

const TabPanel: FC<TabPanelProps> = ({ children, id, ...rest }) => {
  const { activeTab, registerContent, getIsActiveContent } = useContext(
    context
  );
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

type TabProps = {
  /**
   * Unique identifier for the tab
   */
  id: string;
} & React.ComponentProps<'button'>;

export const Tab: FC<TabProps> = ({ children, id, style }) => {
  const { activeTab, setActiveTab, registerTab, getIsActiveTab } = useContext(
    context
  );
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

export type TabsProps = {
  /**
   * Id of the tab which is active by default
   */
  defaultActiveTab: string;
};

type TabsCompoundComponents = {
  List: typeof TabList;
  Tab: typeof Tab;
  Panel: typeof TabPanel;
};

export const Tabs: FC<TabsProps & React.ComponentProps<'div'>> &
  TabsCompoundComponents = ({ children, defaultActiveTab }) => {
  const [tabs, setTabs] = React.useState<(HTMLButtonElement | string)[]>([]);
  const [contents, setContents] = React.useState<HTMLDivElement[]>([]);
  const registerTab = React.useCallback((tab: HTMLButtonElement) => {
    setTabs((tabs) => [tab, ...tabs]);
  }, []);
  const registerContent = React.useCallback((content: HTMLDivElement) => {
    setContents((contents) => [content, ...contents]);
  }, []);
  const [activeTab, setActiveTab] = useState<string | HTMLButtonElement>(
    defaultActiveTab
  );

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

  console.log({ tabs, contents });

  const ctx = useMemo(
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

  return (
    <TabsProvider value={ctx}>
      <div>{children}</div>
    </TabsProvider>
  );
};

Tabs.List = TabList;
Tabs.Tab = Tab;
Tabs.Panel = TabPanel;
