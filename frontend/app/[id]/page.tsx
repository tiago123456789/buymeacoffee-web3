import { CustomizePage } from "@/models/customize-page";
import Image from "next/image";
import LogoSupporter from "@/assets/imgs/supporter.webp"

// @ts-ignore
export default async function UserCustomizedPage({ params }) {
    let customizePage: CustomizePage = await loadCustomizedPageByUserId();

    async function loadCustomizedPageByUserId() {
        const response = await fetch({
            method: "GET",
            url: `http://localhost:3000/users/${params.id}/pages-customized`,
            headers: {
                // @ts-ignore
                "Content-Type": "application/json"
            }
        }, { next: { revalidate: 60 } })

        return response.json()
    }


    return (
        <div style={{ marginTop: "50px" }}>
            <div className="grid place-items-center">
                <Image
                    src={customizePage.imageBackground}
                    alt="Profile image"
                    width={175} height={100}
                />
                {customizePage.enableTotalSupporters == true &&
                    <span>2 supporters</span>
                }

                <span>{customizePage.whatAreYouDoing}</span>

            </div>
            <br />

            <div className="grid grid-flow-col gap-4">
                <div

                    className="row-span-3 col-span-2 max-w-3xl text-justify rounded overflow-hidden shadow-lg">
                    <div className="px-8" >
                        <p className="text-white-700 text-base">
                            {customizePage.description}
                        </p>
                    </div>
                </div>
                <div className="w-full max-w-xs">
                    <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                        <div className="mb-4">
                            <label
                                className="block text-gray-700 text-sm font-bold mb-2"
                                htmlFor="username"
                            >
                                Value:
                            </label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="username"
                                type="text"
                                placeholder=""
                            />
                        </div>
                        <div className="mb-6">
                            <label
                                className="block text-gray-700 text-sm font-bold mb-2"
                                htmlFor="password"
                            >
                                Message
                            </label>
                            <textarea
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                                id="text"
                                placeholder=""
                            ></textarea>
                        </div>
                        <div className="flex items-center justify-between">
                            <button
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                type="button"
                            >
                                Support
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <div className="grid grid-flow-col gap-4">
                <div className="row-span-1 col-span-2 max-w-3xl text-justify rounded overflow-hidden shadow-lg">
                    <div className="px-8">
                        <div className="w-full max-w-3lg ">
                            <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                                <div className="my-2 px-2 py-2" style={{ "border": "1px solid rgba(0, 0, 0, .3)" }}>
                                    <div className="grid grid-cols-4 my-1">
                                        <Image
                                            src={LogoSupporter}
                                            alt="Default supporter image"
                                            width={50} height={50}
                                        />
                                        <span className="text-black" style={{ marginLeft: "-90px" }}><strong>Supporter(0.0001 ether)</strong></span>
                                    </div>
                                    <p className="text-black bg-gray-100 px-4 py-4">Good job! Keep doing that great job.</p>
                                </div>

                                <div className="my-2 px-2 py-2" style={{ "border": "1px solid rgba(0, 0, 0, .3)" }}>
                                    <div className="grid grid-cols-4 my-1">
                                        <Image
                                            src={LogoSupporter}
                                            alt="Default supporter image"
                                            width={50} height={50}
                                        />
                                        <span className="text-black" style={{ marginLeft: "-90px" }}><strong>Supporter(0.0001 ether)</strong></span>
                                    </div>
                                    <p className="text-black bg-gray-100 px-4 py-4">Good job! Keep doing that great job.</p>
                                </div>

                                <div className="my-2 px-2 py-2" style={{ "border": "1px solid rgba(0, 0, 0, .3)" }}>
                                    <div className="grid grid-cols-4 my-1">
                                        <Image
                                            src={LogoSupporter}
                                            alt="Default supporter image"
                                            width={50} height={50}
                                        />
                                        <span className="text-black" style={{ marginLeft: "-90px" }}><strong>Supporter(0.0001 ether)</strong></span>
                                    </div>
                                    <p className="text-black bg-gray-100 px-4 py-4">Good job! Keep doing that great job.</p>
                                </div>

                                <div className="my-2 px-2 py-2" style={{ "border": "1px solid rgba(0, 0, 0, .3)" }}>
                                    <div className="grid grid-cols-4 my-1">
                                        <Image
                                            src={LogoSupporter}
                                            alt="Default supporter image"
                                            width={50} height={50}
                                        />
                                        <span className="text-black" style={{ marginLeft: "-90px" }}><strong>Supporter(0.0001 ether)</strong></span>
                                    </div>
                                    <p className="text-black bg-gray-100 px-4 py-4">Good job! Keep doing that great job.</p>
                                </div>

                            </div>

                        </div>
                    </div>
                </div>

            </div>

        </div>

    )
}
