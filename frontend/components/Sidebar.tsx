import { PAGE_CUSTOMIZE, PAGE_DASHBOARD } from "@/constants/page";
import Link from "next/link";
import { PropsWithChildren } from "react";

export default function Sidebar(props: PropsWithChildren) {

    return (
        <>
            <button
                data-drawer-target="default-sidebar"
                data-drawer-toggle="default-sidebar"
                aria-controls="default-sidebar"
                type="button"
                className="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            >
                <span className="sr-only">Open sidebar</span>
                <svg
                    className="w-6 h-6"
                    aria-hidden="true"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        clipRule="evenodd"
                        fillRule="evenodd"
                        d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
                    />
                </svg>
            </button>
            <aside
                id="default-sidebar"
                className="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0"
                aria-label="Sidebar"
            >
                <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
                    <ul className="space-y-2 font-medium">
                        <li>
                            <Link
                                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                                href={PAGE_DASHBOARD}>
                                <span className="ms-3">Dashboard</span>
                            </Link>
                        </li>
                        <li>
                            <Link
                                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                                href={PAGE_CUSTOMIZE}>
                                <span className="flex-1 ms-3 whitespace-nowrap">Customize page</span>
                            </Link>
                        </li>
                        <li>
                            <a
                                href="#"
                                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                            >
                                <span className="flex-1 ms-3 whitespace-nowrap">Sign out</span>
                            </a>
                        </li>
                    </ul>
                </div>
            </aside>
            <div className="p-4 sm:ml-64">
                <div className="p-4 border-gray-200 rounded-lg dark:border-gray-700">
                    {props.children}
                </div>
            </div>
        </>

    )
}