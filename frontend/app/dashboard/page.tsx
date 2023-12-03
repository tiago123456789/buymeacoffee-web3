import Sidebar from "@/components/Sidebar";

export default function Login() {

    return (
        <Sidebar>
            <div className="grid grid-cols-3 gap-3">
                <a
                    href="#"
                    className="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
                >
                    <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                        100(ethers)
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
                        50(ethers)
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
                        50
                    </h5>
                    <p className="font-normal text-gray-700 dark:text-gray-400">
                        Total supporters
                    </p>
                </a>
            </div>
        </Sidebar>

    )
}