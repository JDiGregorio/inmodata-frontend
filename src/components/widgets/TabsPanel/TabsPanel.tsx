import { classNames } from "@/lib/utils"
import React, { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router"

export interface TabPanel {
    view: boolean
    name: string
    hash: string
    active: boolean
    content: React.ReactElement
}

interface TabsPanelProps {
    tabs: TabPanel[]
}

const TabsPanel = ({ tabs }: TabsPanelProps): React.ReactElement => {
    const navigate = useNavigate()
    const location = useLocation()
    const [activeTab, setActiveTab] = useState(location.hash || tabs[0].hash)

    useEffect(() => {
        if (!location.hash) {
            navigate(tabs[0].hash, { replace: true })
        }
        setActiveTab(location.hash)
    }, [location, navigate, tabs])

    const handleTabClick = (hash: string) => {
        navigate(hash)
    };

    const getActiveTabContents = (hash: string): React.ReactElement => {
        return tabs.find((tab) => tab.hash === hash)?.content ?? <></>
    }

    return (
        <div>
            <div>
                <div className="sm:block">
                    <nav className="flex space-x-4" aria-label="Tabs">
                        {tabs.map((tab) => tab.view && (
                            <a
                                key={tab.name}
                                onClick={() => handleTabClick(tab.hash)}
                                className={classNames(
                                tab.hash === activeTab ? 'bg-gray-200 text-gray-800' : 'text-gray-600 hover:text-gray-800',
                                'rounded-md px-3 py-2 text-sm font-medium cursor-pointer',
                                )}
                                aria-current={tab.active ? 'page' : undefined}
                            >
                                {tab.name}
                            </a>
                        ))}
                    </nav>
                </div>
            </div>

            { getActiveTabContents(activeTab) }

        </div>
    )
  }

  export default TabsPanel