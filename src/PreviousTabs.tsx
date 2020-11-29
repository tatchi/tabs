import React, { createContext, FC, useContext, useMemo, useState } from 'react';

const context = createContext<{
  activeTab: string;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
}>({ activeTab: '', setActiveTab: () => null });

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

const TabContents: FC = ({ children, ...rest }) => (
  <div {...rest}>{children}</div>
);

type TabPanelProps = {
  id: string;
} & React.ComponentProps<'div'>;

const TabContent: FC<TabPanelProps> = ({ children, id, ...rest }) => {
  const { activeTab } = useContext(context);
  return activeTab === id ? <div {...rest}>{children}</div> : null;
};

type TabProps = {
  /**
   * Unique identifier for the tab
   */
  id: string;
} & React.ComponentProps<'button'>;

export const Tab: FC<TabProps> = ({ children, id, style }) => {
  const { activeTab, setActiveTab } = useContext(context);
  const isActive = activeTab === id;
  return (
    <button
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
      onClick={() => setActiveTab(id)}
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
  TabList: typeof TabList;
  Tab: typeof Tab;
  TabContents: typeof TabContents;
  TabContent: typeof TabContent;
};

export const Tabs: FC<TabsProps & React.ComponentProps<'div'>> &
  TabsCompoundComponents = ({ children, defaultActiveTab }) => {
  const [activeTab, setActiveTab] = useState(defaultActiveTab);

  const ctx = useMemo(() => ({ activeTab, setActiveTab }), [activeTab]);

  return (
    <TabsProvider value={ctx}>
      <div>{children}</div>
    </TabsProvider>
  );
};

Tabs.TabList = TabList;
Tabs.Tab = Tab;
Tabs.TabContents = TabContents;
Tabs.TabContent = TabContent;
