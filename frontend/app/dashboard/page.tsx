"use client"

import Metric from "@/models/metric";
import HttpClient from "@/services/http-client";
import { useEffect, useState } from "react";

export default function Login() {
    const [metrics, setMetrics] = useState<Metric>({
        totalDonations: 0,
        totalSupporters: 0,
        totalValueLast30Days: 0
    })

    const getMetrics = async () => {
        const data = await new HttpClient().get("users/dashboard-metrics", {})
        setMetrics(data)
    }

    useEffect(() => {
        getMetrics()
    }, [])

    return (
        <div className="grid grid-cols-3 gap-3">
            <a
                href="#"
                className="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
            >
                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                    {metrics.totalDonations}(ethers)
                </h5>
                <p className="font-normal text-gray-700 dark:text-gray-400">
                    All donations
                </p>
            </a>

            <a
                href="#"
                className="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
            >
                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                    {metrics.totalValueLast30Days}(ethers)
                </h5>
                <p className="font-normal text-gray-700 dark:text-gray-400">
                    Last 30 days
                </p>
            </a>

            <a
                href="#"
                className="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
            >
                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                    {metrics.totalSupporters}
                </h5>
                <p className="font-normal text-gray-700 dark:text-gray-400">
                    Total supporters
                </p>
            </a>
        </div>
    )
}