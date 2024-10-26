'use client'
import { Carousel } from 'primereact/carousel';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { CiShoppingCart } from "react-icons/ci";
import { MdOutlineLocationOn } from "react-icons/md";
import { GoInbox } from "react-icons/go";
import { FaRegComment } from "react-icons/fa";
import Link from 'next/link';
import { CgEye } from "react-icons/cg";
import { RiFileEditLine } from "react-icons/ri";
import { FaArrowRight } from "react-icons/fa6";


export default function AppUserHomePage(props: any) {
    const listHomeCommonData = props?.listHomeCommonData;
    const summaryData = listHomeCommonData?.summaryData;
    const topData = listHomeCommonData?.topData;
    const listHtmlData = props?.htmlData;
    const listHomeUserData = props?.listHomeUserData;

    console.log("summaryData", summaryData);
    console.log("topData", topData);
    console.log("listHtmlData", listHtmlData);
    console.log("listHomeUserData", listHomeUserData);


    const itemTemplate = (item: any) => {
        return (
            <div className="product-item">
                <div className="product-item-content p-5 shadow-lg rounded-lg">
                    <div className="mb-3 flex justify-center">
                        <img
                            src="https://i.pinimg.com/736x/a3/ed/71/a3ed71def3bc46b89354b0f68f660651.jpg"
                            alt={item.name}
                            className="h-48 w-48 object-cover rounded-full"
                        />
                    </div>
                    <div className="text-center">
                        <h4 className="text-lg font-semibold mb-1">{item.name}</h4>
                        <h6 className="text-gray-600 text-sm mb-3">{item.emailId}</h6>
                        <div className="car-buttons flex justify-center gap-3 mt-5">
                            <Link href={`/admin/appuser/view/${item.id}`} className="flex items-center justify-center rounded-full p-3 bg-green-800">
                                <CgEye className=' text-white h-7 w-7' />
                            </Link>
                            <Link href={`/admin/appuser/edit/${item.id}`} className="flex items-center justify-center rounded-full p-3 bg-green-800">
                                <RiFileEditLine className=' text-white h-7 w-7' />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    };


    return (
        <div className='relative h-screen flex flex-col'>
            <div className="flex flex-col h-full overflow-y-auto border-none mb-20">
                <section className="p-2">
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-5">
                        <div className="bg-white shadow p-5 border border-gray-200 rounded">
                            <div className="flex justify-between mb-3">
                                <div>
                                    <span className="block text-gray-500 font-medium mb-3">Total</span>
                                    <div className="text-gray-900 font-medium text-xl">{summaryData[0].total}</div>
                                </div>
                                <div className="flex items-center justify-center bg-blue-100 rounded" style={{ width: '2.5rem', height: '2.5rem' }}>
                                    <CiShoppingCart className=' text-blue-500 h-7 w-7' />

                                </div>
                            </div>
                        </div>

                        <div className="bg-white shadow p-5 border border-gray-200 rounded">
                            <div className="flex justify-between mb-3">
                                <div>
                                    <span className="block text-gray-500 font-medium mb-3">Average</span>
                                    <div className="text-gray-900 font-medium text-xl">{summaryData[0].avgNo}</div>
                                </div>
                                <div className="flex items-center justify-center bg-orange-100 rounded" style={{ width: '2.5rem', height: '2.5rem' }}>
                                    <MdOutlineLocationOn className=' text-orange-500 h-7 w-7' />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white shadow p-5 border border-gray-200 rounded">
                            <div className="flex justify-between mb-3">
                                <div>
                                    <span className="block text-gray-500 font-medium mb-3">Max No</span>
                                    <div className="text-gray-900 font-medium text-xl">{summaryData[0].maxNo}</div>
                                </div>
                                <div className="flex items-center justify-center bg-cyan-100 rounded" style={{ width: '2.5rem', height: '2.5rem' }}>
                                    <GoInbox className=' text-cyan-500  h-7 w-7' />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white shadow p-5 border border-gray-200 rounded">
                            <div className="flex justify-between mb-3">
                                <div>
                                    <span className="block text-gray-500 font-medium mb-3">Min No</span>
                                    <div className="text-gray-900 font-medium text-xl">{summaryData[0].minNo}</div>
                                </div>
                                <div className="flex items-center justify-center bg-purple-100 rounded" style={{ width: '2.5rem', height: '2.5rem' }}>
                                    <FaRegComment className=' text-purple-500 h-7 w-7' />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="flex items-center justify-center my-5">
                    <Link href="/admin/appuser/">
                        <Button
                            label="View all AppUsers"
                            className="p-button-raised p-button-rounded rounded-md bg-green-700 text-white p-4"
                        />
                    </Link>
                </section>

                <section className="p-2">
                    {topData && (
                        <div>
                            <h5 className="text-left text-3xl font-bold mb-5">Achievers</h5>
                            <Carousel
                                value={topData}
                                numVisible={3}
                                numScroll={3}
                                circular={false}
                                itemTemplate={itemTemplate}
                            />
                        </div>
                    )}
                </section>

                <section className="p-2">
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                        <div className="bg-white shadow-md rounded p-4">
                            <div className="flex justify-between items-center mb-5">
                                <span className="text-xl font-medium">Created by Me</span>
                            </div>
                            <ul className="">
                                {listHomeUserData?.topData?.map((item: any) => (
                                    <li
                                        key={item.name}
                                        className="flex flex-row items-center justify-between gap-20 mb-4"
                                    >
                                        <div className="flex-shrink-0">
                                            <img
                                                src="https://i.pinimg.com/736x/a3/ed/71/a3ed71def3bc46b89354b0f68f660651.jpg"
                                                alt={item.name}
                                                className="w-60 h-60 object-cover rounded-full"
                                            />
                                        </div>

                                        <div className="flex flex-col justify-between flex-1">
                                            <div>
                                                <span className="font-medium text-gray-900">{item.name}</span>
                                                <div className="text-gray-600">{item.emailId}</div>
                                            </div>
                                            <div className="mt-2 flex space-x-2">
                                                <Link
                                                    href={`/admin/appuser/view/${item.id}`}
                                                    className="flex items-center justify-center rounded-full p-3 bg-green-800"
                                                >
                                                    <CgEye className="text-white h-7 w-7" />
                                                </Link>
                                                <Link
                                                    href={`/admin/appuser/edit/${item.id}`}
                                                    className="flex items-center justify-center rounded-full p-3 bg-green-800"
                                                >
                                                    <RiFileEditLine className="text-white h-7 w-7" />
                                                </Link>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="bg-white shadow-md rounded p-4">
                            <div className="flex justify-between items-center mb-5">
                                <span className="text-xl font-medium">
                                    Top {listHomeCommonData?.topData?.length} Users
                                </span>
                            </div>

                            <ul className="max-h-80">
                                {listHomeCommonData?.topData?.map((item: any) => (
                                    <li
                                        key={item.name}
                                        className="flex flex-row items-center justify-between gap-20 mb-4"
                                    >
                                        <div className="flex-shrink-0">
                                            <img
                                                src="https://i.pinimg.com/736x/a3/ed/71/a3ed71def3bc46b89354b0f68f660651.jpg"
                                                alt={item.name}
                                                className="w-60 h-60 object-cover rounded-full"
                                            />
                                        </div>

                                        <div className="flex flex-col justify-between flex-1">
                                            <div>
                                                <span className="font-medium text-gray-900">{item.name}</span>
                                                <div className="text-gray-600">{item.emailId}</div>
                                            </div>
                                            <div className="mt-2 flex space-x-2">
                                                <Link
                                                    href={`/admin/appuser/view/${item.id}`}
                                                    className="flex items-center justify-center rounded-full p-3 bg-green-800"
                                                >
                                                    <CgEye className="text-white h-7 w-7" />
                                                </Link>
                                                <Link
                                                    href={`/admin/appuser/edit/${item.id}`}
                                                    className="flex items-center justify-center rounded-full p-3 bg-green-800"
                                                >
                                                    <RiFileEditLine className="text-white h-7 w-7" />
                                                </Link>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </section>

                {listHomeCommonData?.lastData?.length > 0 && (
                    <section className="p-2">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                            {listHomeCommonData.lastData.slice(0, 3).map((item: any, index: any) => (
                                <Card key={index} className="shadow-md text-center p-5">
                                    <img
                                        src={`https://www.primefaces.org/primeblocks-ng/assets/images/blocks/illustration/${index === 0 ? 'windows' : index === 1 ? 'security' : 'live-collaboration'}.svg`}
                                        alt="Image"
                                        className="mx-auto block mb-4"
                                    />
                                    <div className="text-xl font-medium mb-3 text-gray-900">{item.name}</div>
                                    <p className="text-gray-600 mb-4">
                                        Nunc mi ipsum faucibus vitae aliquet nec. Lacus sed viverra tellus in hac habitasse platea dictumst.
                                    </p>
                                    <div className='flex space-x-2 justify-center'>
                                        <Link
                                            href={`/admin/appuser/view/${item.id}`}
                                            className="flex items-center text-white rounded-full p-3 bg-green-800 space-x-2"
                                        >
                                            <FaArrowRight className="w-5 h-5" />
                                            <span>View</span>
                                        </Link>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </section>
                )}

                <div className="table-title">
                    {listHtmlData && listHtmlData.length && (
                        <div
                            dangerouslySetInnerHTML={{
                                __html: listHtmlData.join(''),
                            }}
                        />
                    )}
                </div>
            </div>
        </div>
    )
}
