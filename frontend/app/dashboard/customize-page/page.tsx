"use client"

import HttpClient from "@/services/http-client"
import { useCallback, useEffect, useState } from "react"
import { useDropzone } from "react-dropzone"
import { ToastContainer, toast } from "react-toastify"
import { getCookie } from "cookies-next";

import 'react-toastify/dist/ReactToastify.css';
import { KEY_ACCESS_TOKEN } from "@/constants/app"
import { CustomizePage } from "@/models/customize-page"
import Link from "next/link"


export default function CustomizePage() {
    const [customizePage, setCustomizePage] = useState<CustomizePage>({
        id: null,
        file: null,
        imageBackground: null,
        name: "",
        enableTotalSupporters: true,
        themeColor: "",
        whatAreYouDoing: "",
        featuredVideo: "",
        description: ""
    })

    const onDrop = useCallback((acceptedFiles: any) => {
        const file = acceptedFiles[0]

        const fileUrl = URL.createObjectURL(file)
        setCustomizePage({
            ...customizePage,
            // @ts-ignore
            imageBackground: fileUrl,
            file: file,
            name: file.name
        })
    }, [])

    const { getRootProps, getInputProps } = useDropzone({ onDrop })

    const onChangeInputValue = (key: string, value: any) => {
        setCustomizePage({
            ...customizePage,
            [key]: value
        })
    }

    const onSubmit = async (event: any) => {
        try {
            event.preventDefault()
            if (!customizePage.id) {
                await new HttpClient().postForm("users/pages-customized", customizePage, {})
                toast.success("Create customized page!")
            } else {
                await new HttpClient().putForm("users/pages-customized", customizePage, {})
                toast.success("Change applied success!")
            }
            setCustomizePage({
                id: null,
                file: null,
                imageBackground: null,
                name: "",
                enableTotalSupporters: true,
                themeColor: "",
                whatAreYouDoing: "",
                featuredVideo: "",
                description: ""
            })
            loadCustomizedPageByUserId()
        } catch (error: any) {
            toast.error(error?.response?.data.message || "Oops! Internal server error")
        }
    }

    const getUserId = () => {
        const accessToken = getCookie(KEY_ACCESS_TOKEN)
        if (!accessToken) return;
        const payload: string = accessToken.split(".")[1]
        const payloadDecode = atob(payload)
        return JSON.parse(payloadDecode)["id"]
    }

    const loadCustomizedPageByUserId = async () => {
        const userId = getUserId()
        const data = await new HttpClient().get(`users/${userId}/pages-customized`, {})

        setCustomizePage({
            id: data.id,
            imageBackground: data.imageBackground,
            file: null,
            name: data.name,
            enableTotalSupporters: data.enableTotalSupporters,
            themeColor: data.themeColor,
            whatAreYouDoing: data.whatAreYouDoing,
            featuredVideo: data.featuredVideo,
            description: data.description
        })
    }

    const isLoadImageBackground = () => {
        return (customizePage.file == null && customizePage.imageBackground != null)
    }

    const isLoadFileUpload = () => {
        return (customizePage.file !== null && customizePage.imageBackground != null)
    }

    useEffect(() => {
        loadCustomizedPageByUserId()
    }, [])

    return (
        <>
            {customizePage.id &&
                <Link href={`/${getUserId()}`}>
                    <button
                        type="button"
                        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                        See your page
                    </button>
                </Link>

            }

            <div className="flex items-center">
                <div className="mx-auto w-full bg-white">
                    <form
                        onSubmit={onSubmit}
                        className="py-6 px-9"
                    >
                        {isLoadImageBackground() &&
                            <img
                                width={250}
                                height={250}
                                src={customizePage.imageBackground} />
                        }

                        {isLoadFileUpload() &&
                            <img
                                width={250}
                                height={250}
                                src={customizePage.imageBackground} />
                        }
                        <br />
                        <div {...getRootProps()} style={{
                            width: "100%",
                            height: "70px",
                            border: "1px solid rgba(0, 0, 0, .5)",
                            textAlign: "center",
                            marginBottom: "10px",
                            borderRadius: "5px"
                        }}>
                            <input {...getInputProps()} onDrop={onDrop} />
                            <p style={{
                                color: "black",
                                marginTop: "20px"
                            }}>
                                {
                                    customizePage.file
                                        ? `Selected ${customizePage.file.name} file`
                                        : 'Drag and drop some files here, or click to select files'
                                }</p>
                        </div>
                        <div className="mb-5">
                            <label
                                htmlFor="whatAreYouDoing"
                                className="mb-3 block text-base font-medium text-[#07074D]"
                            >
                                Enable total supporters:
                            </label>
                            <select
                                onChange={event => onChangeInputValue("enableTotalSupporters", event.target.value)}
                                className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                            >
                                <option value="true" defaultChecked>Yes</option>
                                <option value="false">No</option>
                            </select>
                        </div>

                        <div className="mb-5">
                            <label
                                htmlFor="whatAreYouDoing"
                                className="mb-3 block text-base font-medium text-[#07074D]"
                            >
                                Theme color:
                            </label>
                            <div className="flex justify-center space-x-2">
                                <input
                                    value={customizePage.themeColor}
                                    onChange={event => onChangeInputValue("themeColor", event.target.value)}
                                    id="themeColor"
                                    type="color"
                                    className="w-full rounded-md border border-[#e0e0e0] bg-white text-base font-medium text-[#6B7280]"
                                />
                            </div>
                        </div>

                        <div className="mb-5">
                            <label
                                htmlFor="whatAreYouDoing"
                                className="mb-3 block text-base font-medium text-[#07074D]"
                            >
                                What are you doing:
                            </label>
                            <input
                                value={customizePage.whatAreYouDoing}
                                onChange={event => onChangeInputValue("whatAreYouDoing", event.target.value)}
                                type="text"
                                name="whatAreYouDoing"
                                id="whatAreYouDoing"
                                placeholder=""
                                className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                            />
                        </div>

                        <div className="mb-5">
                            <label
                                htmlFor="whatAreYouDoing"
                                className="mb-3 block text-base font-medium text-[#07074D]"
                            >
                                Featured video:
                            </label>
                            <input
                                value={customizePage.featuredVideo}
                                type="url"
                                onChange={event => onChangeInputValue("featuredVideo", event.target.value)}
                                name="featuredVideo"
                                id="featuredVideo"
                                placeholder=""
                                className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                            />
                        </div>


                        <div className="mb-5">
                            <label
                                htmlFor="description"
                                className="mb-3 block text-base font-medium text-[#07074D]"
                            >
                                Description:
                            </label>
                            <textarea
                                value={customizePage.description}
                                onChange={event => onChangeInputValue("description", event.target.value)}
                                name="description"
                                id="description"
                                placeholder=""
                                className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                            />
                        </div>
                        <div>
                            <button
                                className="hover:shadow-form rounded-md bg-cyan-600 py-3 px-8 text-center text-base font-semibold text-white outline-none">
                                Publish
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            <ToastContainer />

        </>

    )
}