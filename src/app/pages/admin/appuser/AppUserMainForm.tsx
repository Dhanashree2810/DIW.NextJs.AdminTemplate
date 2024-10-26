'use client';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import "primeflex/primeflex.css";
import React, { useState, useEffect } from 'react';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { TabView, TabPanel } from 'primereact/tabview';
import { Button } from "@/components/ui/button";
import { HiArrowLongLeft } from "react-icons/hi2";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from 'next/image';
import { FaSave } from "react-icons/fa";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import Link from 'next/link';
import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";
import TooltipWithText from '@/components/custom/TooltipWithText';
import globalschema from '../../../../../globalschema';
import { addFunAllUsers, updateFunAllUsers } from '@/app/actions/appuser';
import { Textarea } from '@/components/ui/textarea';
import { fetchFunEnumDet } from '@/app/actions/enumdetail';
import { downloadFileAppUser, uploadAppUser } from '@/services/appusers';
import FileUploadMain from '@/components/custom/FileUploadMain';

type FileData = {
    gstCertificate: never[];
    photoShopFront: never[];
    visitingCard: never[];
    cheque: never[];
    photoAttachment: never[];
};


const AppUserMainForm = ({ appUserData, tokendata }: any) => {
    const [showDialog, setShowDialog] = useState(false);
    const [formData, setFormData] = useState({
        id: '', name: '', firstName: '', lastName: '', mobile: '', mobileVerified: false,
        emailId: '', emailVerified: false, shopName: '', password: '',
        pincode: '', state: '', district: '', address: '', addressLine: '',
        verifyShop: '', gst: '', gstCertificate: null, photoShopFront: null, visitingCard: null, cheque: null, gstOtp: '',
        isActive: false, isAdmin: false, hasImpersonateAccess: false, photoAttachment: null, role: '', publish: '', lastLogin: '',
        defaultLanguage: '', isPremiumUser: false, totalPlot: '',
    });
    const [errors, setErrors] = useState({ name: '', mobile: '', mobileVerifiedError: '', role: '', isActiveError: '', isAdminError: '', publish: '' });
    const [activeIndex, setActiveIndex] = useState(0);
    const [verifyShops, setVerifyShops] = useState([]);
    const [selectedVerifyShops, setSelectedVerifyShops] = useState<any>(null);
    const [roles, setRoles] = useState([]);
    const [selectedRoles, setSelectedRoles] = useState<any>(null);
    const [publishes, setPublishes] = useState([]);
    const [selectedPublishes, setSelectedPublishes] = useState<any>(null);
    const [isTab1Valid, setIsTab1Valid] = useState(false);
    const [isTab4Valid, setIsTab4Valid] = useState(false);
    const [fileData, setFileData] = useState({
        gstCertificate: [],
        photoShopFront: [],
        visitingCard: [],
        cheque: [],
        photoAttachment: [],
    });


    useEffect(() => {
        getVerifyShopsData();
    }, []);

    const getVerifyShopsData = async () => {
        try {
            const data = await fetchFunEnumDet();
            if (data) {
                const filterShops = data.filter((a: any) => a.section === 'VerifyType');
                setVerifyShops(filterShops);
                if (appUserData && appUserData.verifyShop) {
                    const selectedList = data.filter((a: any) => a.value === appUserData.verifyShop);
                    if (selectedList.length) {
                        setSelectedVerifyShops(selectedList[0].value);
                    }
                }

                const filterrole = data.filter((a: any) => a.section === 'RoleType');
                setRoles(filterrole);
                if (appUserData && appUserData.role) {
                    const selectedList = data.filter((a: any) => a.value === appUserData.role);
                    if (selectedList.length) {
                        setSelectedVerifyShops(selectedList[0].value);
                    }
                }

                const filterpublish = data.filter((a: any) => a.section === 'PublishType');
                setPublishes(filterpublish);
                if (appUserData && appUserData.publish) {
                    const selectedList = data.filter((a: any) => a.value === appUserData.publish);
                    if (selectedList.length) {
                        setSelectedPublishes(selectedList[0].value);
                    }
                }
            } else {
                throw new Error("No data found");
            }
        } catch (error) {
            console.error("Fetch error ", error);
        }
    };


    useEffect(() => {
        if (appUserData) {
            const parseAndFormatImages = (imageData: string | null) => {
                if (!imageData) return [];
                try {
                    const parsedFiles = JSON.parse(imageData);
                    return parsedFiles.map((img: any) => ({
                        fileName: img.fileName,
                        filePath: img.filePath.replace(/\\/g, "/"),
                        type: img.type,
                    }));
                } catch (error) {
                    console.error("Failed to parse image data:", error);
                    return [];
                }
            };
            setFileData({
                gstCertificate: parseAndFormatImages(appUserData.gstCertificate),
                photoShopFront: parseAndFormatImages(appUserData.photoShopFront),
                cheque: parseAndFormatImages(appUserData.cheque),
                visitingCard: parseAndFormatImages(appUserData.visitingCard),
                photoAttachment: parseAndFormatImages(appUserData.photoAttachment),
            });

            setFormData({
                ...appUserData,
                lastLogin: appUserData.lastLogin ? appUserData.lastLogin.slice(0, 10) : '',
            });
            // setSelectedVerifyShops(appUserData.verifyShop);
            // setSelectedRoles(appUserData.role);
            // setSelectedPublishes(appUserData.publish);           
        }
    }, [appUserData]);

    useEffect(() => {
        if (activeIndex === 0) validateTab1();
        if (activeIndex === 3) validateTab4();
    }, [activeIndex, formData]);

    const validateTab1 = () => {
        const result = globalschema.safeParse({
            name: formData.name,
            mobile: formData.mobile,
            mobileVerified: formData.mobileVerified ?? false,
        });

        if (!result.success) {
            const fieldErrors = result.error.flatten().fieldErrors;
            setErrors(prevErrors => ({
                ...prevErrors,
                name: fieldErrors.name ? fieldErrors.name[0] : '',
                mobile: fieldErrors.mobile ? fieldErrors.mobile[0] : '',
                mobileVerifiedError: fieldErrors.mobileVerified ? fieldErrors.mobileVerified[0] : '',
            }));
            setIsTab1Valid(false);
        } else {
            setErrors(prevErrors => ({
                ...prevErrors,
                name: '',
                mobile: '',
                mobileVerifiedError: ''
            }));
            setIsTab1Valid(true);
        }
    };

    const validateTab4 = () => {
        const result = globalschema.safeParse({
            role: formData.role,
            isActive: formData.isActive ?? false,
            isAdmin: formData.isAdmin ?? false,
            publish: formData.publish,
        });

        if (!result.success) {
            const fieldErrors = result.error.flatten().fieldErrors;
            setErrors(prevErrors => ({
                ...prevErrors,
                role: fieldErrors.role ? fieldErrors.role[0] : '',
                isAdminError: fieldErrors.isAdmin ? fieldErrors.isAdmin[0] : '',
                isActiveError: fieldErrors.isActive ? fieldErrors.isActive[0] : '',
                publish: fieldErrors.publish ? fieldErrors.publish[0] : '',
            }));
            setIsTab4Valid(false);
        } else {
            setErrors(prevErrors => ({
                ...prevErrors,
                role: '',
                isActiveError: '',
                isAdminError: '',
                publish: ''
            }));
            setIsTab4Valid(true);
        }
    };

    const handleVerifyShopSelect = (value: any) => {
        setSelectedVerifyShops(value);
        setFormData(prevData => {
            const newFormData = {
                ...prevData,
                verifyShop: value ? value : ''
            };
            return newFormData;
        });
    };

    const selectedDropdownTemplate = (option: any, props: any) => {
        return option ? (
            <div className="flex align-items-center">
                <div>{option.name}</div>
            </div>
        ) : (
            <span>{props.placeholder}</span>
        );
    };

    const dropdownOptionTemplate = (option: any) => {
        return (
            <div className="flex align-items-center">
                <div>{option.name}</div>
            </div>
        );
    };

    const handleRoleSelect = (value: any) => {
        setSelectedRoles(value);
        setFormData(prevData => {
            const newFormData = {
                ...prevData,
                role: value ? value : ''
            };
            return newFormData;
        });
        validateTab4();
    };

    const handlePublishSelect = (value: any) => {
        setSelectedPublishes(value);
        setFormData(prevData => {
            const newFormData = {
                ...prevData,
                publish: value ? value : ''
            };
            return newFormData;
        });
        validateTab4();
    };

    const removeEmptyFields = (obj: any) => {
        return Object.keys(obj).reduce((acc, key) => {
            if (obj[key] !== '' && obj[key] !== undefined && obj[key] !== null) {
                acc[key] = obj[key];
            }
            return acc;
        }, {} as Record<string, any>);
    };

    const handleChange = (e: any) => {
        const { name, value, type, checked } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value
        }));
        if (name === 'name' || name === 'mobile' || name === 'mobileVerified') validateTab1();
        if (name === 'role' || name === 'isActive' || name === 'isAdmin' || name === 'publish') validateTab4();
    };


    const handleCloseDialog = () => {
        setShowDialog(false);
    };

    const handleSubmitClick = () => {
        const form = document.getElementById('myForm') as HTMLFormElement | null;
        if (form) {
            form.requestSubmit();
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const isActiveBoolean = formData.isActive === true;
            const mobileVerifiedBoolean = formData.mobileVerified === true;
            const isAdminBoolean = formData.isAdmin === true;
            const hasImpersonateAccessBoolean = formData.hasImpersonateAccess === true;

            let result = globalschema.safeParse({
                name: formData.name,
                mobile: formData.mobile,
                mobileVerified: mobileVerifiedBoolean,
                isActive: isActiveBoolean,
                isAdmin: isAdminBoolean,
                role: formData.role,
                publish: formData.publish,
            });

            if (result && !result.success) {
                const fieldErrors = result.error.flatten().fieldErrors;
                setErrors({
                    name: fieldErrors.name ? fieldErrors.name[0] : '',
                    mobile: fieldErrors.mobile ? fieldErrors.mobile[0] : '',
                    mobileVerifiedError: fieldErrors.mobileVerified ? fieldErrors.mobileVerified[0] : '',
                    role: fieldErrors.role ? fieldErrors.role[0] : '',
                    isActiveError: fieldErrors.isActive ? fieldErrors.isActive[0] : '',
                    isAdminError: fieldErrors.isAdmin ? fieldErrors.isAdmin[0] : '',
                    publish: fieldErrors.publish ? fieldErrors.publish[0] : '',
                });
                return;
            }

            //add or update
            const payload = {
                name: `${formData.firstName ? ' ' + formData.firstName : ''} ${formData.lastName ? ' ' + formData.lastName : ''}`,
                firstName: formData.firstName,
                lastName: formData.lastName,
                mobile: formData.mobile,
                mobileVerified: formData.mobileVerified,
                emailId: formData.emailId,
                emailVerified: formData.emailVerified,
                pincode: formData.pincode,
                password: formData.password,
                state: formData.state,
                district: formData.district,
                address: formData.address,
                addressLine: formData.addressLine,
                verifyShop: formData.verifyShop,
                gst: formData.gst,
                gstCertificate: JSON.stringify(fileData.gstCertificate),
                photoShopFront: JSON.stringify(fileData.photoShopFront),
                visitingCard: JSON.stringify(fileData.visitingCard),
                cheque: JSON.stringify(fileData.cheque),
                gstOtp: formData.gstOtp,
                isActive: formData.isActive,
                isAdmin: formData.isAdmin,
                hasImpersonateAccess: formData.hasImpersonateAccess,
                photoAttachment: JSON.stringify(fileData.photoAttachment),
                role: formData.role,
                roleLabel: formData.role,
                publish: formData.publish,
                publishLabel: formData.publish,
                lastLogin: formData.lastLogin,
                defaultLanguage: formData.defaultLanguage,
                isPremiumUser: formData.isPremiumUser,
                totalPlot: formData.totalPlot,
            };

            const cleanedPayload = removeEmptyFields(payload);

            let response;
            if (appUserData) {
                if (!formData.id) {
                    throw new Error("ID is required for update.");
                }
                response = await updateFunAllUsers({ ...cleanedPayload, id: formData.id });
            } else {
                response = await addFunAllUsers(cleanedPayload);
            }

            if (response) {
                setShowDialog(true);
                setErrors({ name: '', mobile: '', mobileVerifiedError: '', role: '', isActiveError: '', isAdminError: '', publish: '', });
                setFormData({
                    id: '', name: '', firstName: '', lastName: '', mobile: '', mobileVerified: false,
                    emailId: '', emailVerified: false, shopName: '', password: '',
                    pincode: '', state: '', district: '', address: '', addressLine: '',
                    verifyShop: '', gst: '', gstCertificate: null, photoShopFront: null, visitingCard: null, cheque: null, gstOtp: '',
                    isActive: false, isAdmin: false, hasImpersonateAccess: false, photoAttachment: null, role: '', publish: '', lastLogin: '',
                    defaultLanguage: '', isPremiumUser: false, totalPlot: '',
                });
            } else {
                if (appUserData) {
                    throw new Error("Failed to update App User. Please try again later.");
                } else {
                    throw new Error("Failed to save App User. Please try again later.");
                }
            }
        } catch (error) {
            console.error("Error:", error);
            if (appUserData) {
                alert("Failed to update App User. Please try again later.");
            } else {
                alert("Failed to add App User. Please try again later.");
            }
        }
    };

    const getTabClassName = (index: any) =>
        `flex items-center justify-center w-10 h-10 rounded-full border-2 ${activeIndex === index
            ? 'bg-green-800 font-semibold text-white border-green-800'
            : 'bg-gray-200 text-gray-600 border-gray-400'
        }`;

    const getTabLabelClassName = (index: any) =>
        `text-center text-sm ${activeIndex === index ? 'text-green-800 font-bold' : 'text-gray-600'
        }`;

    const handleFileUpload = (newFiles: any[], inputName: keyof FileData) => {
        setFileData((prevData) => ({
            ...prevData,
            [inputName]: newFiles,
        }));
    };

    return (
        <>
            <div className='relative h-screen flex flex-col'>
                <div className=" flex items-center pb-2">
                    <Link href="/admin/appuser/">
                        <HiArrowLongLeft className=" h-9 w-9 cursor-pointer mr-5" />
                    </Link>
                    <h1 className=" capitalize text-lg font-bold">
                        Back to AppUser
                    </h1>
                </div>
                <div className="flex flex-col h-full overflow-y-auto border-none mb-28">
                    <div className="container mx-auto">
                        <form id="myForm" onSubmit={handleSubmit} noValidate>
                            <div className="w-full">
                                <TabView
                                    activeIndex={activeIndex}
                                    onTabChange={(e) => setActiveIndex(e.index)}
                                    className="bg-gray-100"
                                >

                                    {/* Step 1: Access Details */}
                                    <TabPanel
                                        header={
                                            <div className="flex justify-center items-center">
                                                <div className="flex flex-col justify-center items-center flex-1">
                                                    <div className={getTabClassName(0)}>1</div>
                                                    <div className={getTabLabelClassName(0)}>Access Details</div>
                                                </div>
                                            </div>
                                        }
                                        headerClassName={`flex-1 ${activeIndex === 0 ? '' : 'p-disabled'}`}>
                                        <div className="p-2 bg-gray-100">
                                            <div className="grid gap-2 lg:grid-cols-3 md:grid-cols-1 sm:grid-cols-1 pb-5 ">
                                                <div className="flex flex-col">
                                                    <div className=' flex items-center'>
                                                        <Label htmlFor="name" className="text-sm font-bold py-2 px-3">Name</Label>
                                                        <span className=' text-red-600 px-3'>*</span>
                                                        <TooltipWithText text="Name" />
                                                    </div>
                                                    <Input id="name" className=' rounded-none py-6' type="text" placeholder="Name" name="name" value={formData.name} onChange={handleChange} />
                                                    {errors.name && <p className='text-red-600 text-xs pb-5'>{errors.name}</p>}
                                                </div>

                                                <div className="flex flex-col">
                                                    <div className=' flex items-center'>
                                                        <Label htmlFor="firstName" className="text-sm font-bold py-2 px-3">First Name</Label>
                                                        <TooltipWithText text="First Name" />
                                                    </div>
                                                    <Input id="firstName" className=' rounded-none py-6' type="text" placeholder="First Name" name="firstName" value={formData.firstName} onChange={handleChange} />
                                                </div>

                                                <div className="flex flex-col">
                                                    <div className=' flex items-center'>
                                                        <Label htmlFor="lastName" className="text-sm font-bold py-2 px-3">Last Name</Label>
                                                        <TooltipWithText text="Last Name" />
                                                    </div>
                                                    <Input id="lastName" className=' rounded-none py-6' type="text" placeholder="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} />
                                                </div>
                                            </div>

                                            <div className="grid gap-2 lg:grid-cols-3 md:grid-cols-1 sm:grid-cols-1 pb-5 ">
                                                <div className="flex flex-col">
                                                    <div className=' flex items-center'>
                                                        <Label htmlFor="mobile" className="text-sm font-bold py-2 px-3">Mobile</Label>
                                                        <span className=' text-red-600 px-3'>*</span>
                                                        <TooltipWithText text="Mobile" />
                                                    </div>
                                                    <Input id="mobile" className=' rounded-none py-6' type="text" placeholder="Mobile" name="mobile" value={formData.mobile} onChange={handleChange} />
                                                    {errors.mobile && <p className='text-red-600 text-xs py-5 pl-3 '>{errors.mobile}</p>}
                                                </div>

                                                <div className="flex flex-col">
                                                    <div className=' flex items-center'>
                                                        <Label htmlFor="isActive" className="text-sm font-bold py-2 px-3">Mobile Verified</Label>
                                                        <span className=' text-red-600 px-3'>*</span>
                                                        <TooltipWithText text="Mobile Verified" />
                                                    </div>
                                                    <Input id="mobileVerified" className=' rounded-none h-5 w-5 ml-3 mt-2' type="checkbox"
                                                        placeholder="Mobile Verified" name="mobileVerified" checked={formData.mobileVerified} onChange={(e) => {
                                                            setFormData(prevData => ({ ...prevData, mobileVerified: e.target.checked }));
                                                            validateTab1();
                                                        }} />
                                                    {errors.mobileVerifiedError && <p className='text-red-600 text-xs py-5 pl-3 '>{errors.mobileVerifiedError}</p>}
                                                </div>
                                            </div>
                                        </div>
                                    </TabPanel>

                                    {/* Step 2 Shop Details */}
                                    <TabPanel
                                        header={
                                            <div className="flex justify-center w-full">
                                                <div className="flex flex-col items-center flex-1">
                                                    <div className={getTabClassName(1)}>2</div>
                                                    <div className={getTabLabelClassName(1)}>Shop Details</div>
                                                </div>
                                            </div>
                                        }
                                        headerClassName={`flex-1 ${activeIndex === 1 ? '' : 'p-disabled'}`}>
                                        <div className="p-2 bg-gray-100">
                                            <div className="grid gap-2 lg:grid-cols-3 md:grid-cols-1 sm:grid-cols-1 pb-5 ">
                                                <div className="flex flex-col">
                                                    <div className=' flex items-center'>
                                                        <Label htmlFor="emailId" className="text-sm font-bold py-2 px-3"> Email Id</Label>
                                                        <TooltipWithText text=" Email ID" />
                                                    </div>
                                                    <Input id="emailId" className=' rounded-none py-6' type="email" placeholder=" Email ID" name="emailId" value={formData.emailId} onChange={handleChange} />
                                                </div>

                                                <div className="flex flex-col">
                                                    <div className=' flex items-center'>
                                                        <Label htmlFor="emailVerified" className="text-sm font-bold py-2 px-3">Email Verified</Label>
                                                        <TooltipWithText text="Email Verified" />
                                                    </div>
                                                    <Input id="emailVerified" className=' rounded-none h-5 w-5 ml-3 mt-2' type="checkbox"
                                                        placeholder="Email Verified" name="emailVerified" checked={formData.emailVerified} onChange={(e) => setFormData({ ...formData, emailVerified: e.target.checked })} />
                                                </div>

                                                <div className="flex flex-col">
                                                    <div className=' flex items-center'>
                                                        <Label htmlFor="shopName" className="text-sm font-bold py-2 px-3">Shop Name</Label>
                                                        <TooltipWithText text="Shop Name" />
                                                    </div>
                                                    <Input id="shopName" className=' rounded-none py-6' type="text" placeholder="Shop Name" name="shopName" value={formData.shopName} onChange={handleChange} />
                                                </div>
                                            </div>

                                            <div className="grid gap-2 lg:grid-cols-3 md:grid-cols-1 sm:grid-cols-1 pb-5 ">
                                                <div className="flex flex-col">
                                                    <div className=' flex items-center'>
                                                        <Label htmlFor="password" className="text-sm font-bold py-2 px-3">Password</Label>
                                                        <TooltipWithText text="Password" />
                                                    </div>
                                                    <Input id="password" className=' rounded-none py-6' type="password" placeholder="Password" name="password" value={formData.password} onChange={handleChange} />
                                                </div>
                                            </div>
                                        </div>
                                    </TabPanel>

                                    {/* Step 3 Shop Address*/}
                                    <TabPanel
                                        header={
                                            <div className="flex justify-center w-full">
                                                <div className="flex flex-col items-center flex-1">
                                                    <div className={getTabClassName(2)}>3</div>
                                                    <div className={getTabLabelClassName(2)}>Shop Address</div>
                                                </div>
                                            </div>
                                        }
                                        headerClassName={`flex-1 ${activeIndex === 2 ? '' : 'p-disabled'}`}>
                                        <div className="p-2 bg-gray-100">
                                            <div className="grid gap-2 lg:grid-cols-3 md:grid-cols-1 sm:grid-cols-1 pb-5 ">
                                                <div className="flex flex-col">
                                                    <div className=' flex items-center'>
                                                        <Label htmlFor="pincode" className="text-sm font-bold py-2 px-3"> Pincode</Label>
                                                        <TooltipWithText text=" Pincode" />
                                                    </div>
                                                    <Input id="pincode" className=' rounded-none py-6' type="text" placeholder=" Pincode" name="pincode" value={formData.pincode} onChange={handleChange} />
                                                </div>

                                                <div className="flex flex-col">
                                                    <div className=' flex items-center'>
                                                        <Label htmlFor="state" className="text-sm font-bold py-2 px-3">State</Label>
                                                        <TooltipWithText text="State" />
                                                    </div>
                                                    <Input id="state" className=' rounded-none py-6' type="text" placeholder="State" name="state" value={formData.state} onChange={handleChange} />
                                                </div>

                                                <div className="flex flex-col">
                                                    <div className=' flex items-center'>
                                                        <Label htmlFor="district" className="text-sm font-bold py-2 px-3">District</Label>
                                                        <TooltipWithText text="District" />
                                                    </div>
                                                    <Input id="district" className=' rounded-none py-6' type="text" placeholder="District" name="district" value={formData.district} onChange={handleChange} />
                                                </div>
                                            </div>

                                            <div className="grid gap-2 lg:grid-cols-3 md:grid-cols-1 sm:grid-cols-1 pb-5 ">
                                                <div className="flex flex-col">
                                                    <div className=' flex items-center'>
                                                        <Label htmlFor="address" className="text-sm font-bold py-2 px-3"> Address Line 1</Label>
                                                        <TooltipWithText text=" Address Line 1" />
                                                    </div>
                                                    <Textarea id="address" className=' rounded-none py-6' placeholder=" Address Line 1" name="address" value={formData.address} onChange={handleChange} />
                                                </div>

                                                <div className="flex flex-col">
                                                    <div className=' flex items-center'>
                                                        <Label htmlFor="addressLine" className="text-sm font-bold py-2 px-3"> Address Line 2</Label>
                                                        <TooltipWithText text=" Address Line 2" />
                                                    </div>
                                                    <Textarea id="addressLine" className=' rounded-none py-6' placeholder=" Address Line 2" name="addressLine" value={formData.addressLine} onChange={handleChange} />
                                                </div>
                                            </div>
                                        </div>
                                    </TabPanel>

                                    {/* Step 4  Verify Shop*/}
                                    <TabPanel
                                        header={
                                            <div className="flex justify-center w-full">
                                                <div className="flex flex-col items-center flex-1">
                                                    <div className={getTabClassName(3)}>4</div>
                                                    <div className={getTabLabelClassName(3)}>Verify Shop</div>
                                                </div>
                                            </div>
                                        }
                                        headerClassName={`flex-1 ${activeIndex === 3 ? '' : 'p-disabled'}`}>
                                        <div className="p-2 bg-gray-100">
                                            <div className="grid gap-2 lg:grid-cols-3 md:grid-cols-1 sm:grid-cols-1 pb-5 ">
                                                <div className="flex flex-col">
                                                    <div className=' flex items-center'>
                                                        <Label htmlFor="verifyShop" className="text-sm font-bold py-2 px-3"> Verify Shop</Label>
                                                        <TooltipWithText text=" VerifyShop" />
                                                    </div>
                                                    <Dropdown
                                                        value={selectedVerifyShops}
                                                        onChange={(e: DropdownChangeEvent) => handleVerifyShopSelect(e.value)}
                                                        options={verifyShops}
                                                        optionLabel="name"
                                                        placeholder="Select a Verify Shops"
                                                        filter
                                                        valueTemplate={selectedDropdownTemplate}
                                                        itemTemplate={dropdownOptionTemplate}
                                                        className="w-full md:w-14rem"
                                                    />
                                                </div>

                                                <div className="flex flex-col">
                                                    <div className=' flex items-center'>
                                                        <Label htmlFor="gst" className="text-sm font-bold py-2 px-3"> GST Number</Label>
                                                        <TooltipWithText text="GST Number" />
                                                    </div>
                                                    <Input id="gst" className=' rounded-none py-6' type="text" placeholder="GST Number" name="gst" value={formData.gst} onChange={handleChange} />
                                                </div>

                                                <div className="flex flex-col">
                                                    <div className='flex items-center'>
                                                        <Label htmlFor="gstCertificate" className="text-sm font-bold py-2 px-3">GstCertificate</Label>
                                                        <TooltipWithText text="GstCertificate" />
                                                    </div>
                                                    <FileUploadMain
                                                        onFileUpload={(data) => handleFileUpload(data, 'gstCertificate')}
                                                        uploadFunction={uploadAppUser}
                                                        downloadFunction={downloadFileAppUser}
                                                        multiple={true}
                                                        showImage={true}
                                                        accept=".jpg,.jpeg,.png,.pdf"
                                                        tokenData={tokendata}
                                                        existingFiles={fileData.gstCertificate}
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid gap-2 lg:grid-cols-3 md:grid-cols-1 sm:grid-cols-1 pb-5 ">
                                                <div className="flex flex-col">
                                                    <div className='flex items-center'>
                                                        <Label htmlFor="photoShopFront" className="text-sm font-bold py-2 px-3">Photo Shop From Front</Label>
                                                        <TooltipWithText text="Image" />
                                                    </div>
                                                    <FileUploadMain
                                                        onFileUpload={(data) => handleFileUpload(data, 'photoShopFront')}
                                                        uploadFunction={uploadAppUser}
                                                        downloadFunction={downloadFileAppUser}
                                                        multiple={true}
                                                        showImage={true}
                                                        accept=".jpg,.jpeg,.png"
                                                        tokenData={tokendata}
                                                        existingFiles={fileData.photoShopFront}
                                                    />
                                                </div>

                                                <div className="flex flex-col">
                                                    <div className='flex items-center'>
                                                        <Label htmlFor="visitingCard" className="text-sm font-bold py-2 px-3">VisitingCard</Label>
                                                        <TooltipWithText text="VisitingCard" />
                                                    </div>
                                                    <FileUploadMain
                                                        onFileUpload={(data) => handleFileUpload(data, 'visitingCard')}
                                                        uploadFunction={uploadAppUser}
                                                        downloadFunction={downloadFileAppUser}
                                                        multiple={true}
                                                        showImage={true}
                                                        accept=".jpg,.jpeg,.png,.pdf"
                                                        tokenData={tokendata}
                                                        existingFiles={fileData.visitingCard}
                                                    />
                                                </div>

                                                <div className="flex flex-col">
                                                    <div className='flex items-center'>
                                                        <Label htmlFor="cheque" className="text-sm font-bold py-2 px-3">Cheque</Label>
                                                        <TooltipWithText text="Cheque" />
                                                    </div>
                                                    <FileUploadMain
                                                        onFileUpload={(data) => handleFileUpload(data, 'cheque')}
                                                        uploadFunction={uploadAppUser}
                                                        downloadFunction={downloadFileAppUser}
                                                        multiple={true}
                                                        showImage={true}
                                                        accept=".jpg,.jpeg,.png,.pdf"
                                                        tokenData={tokendata}
                                                        existingFiles={fileData.cheque}
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid gap-2 lg:grid-cols-3 md:grid-cols-1 sm:grid-cols-1 pb-5 ">
                                                <div className="flex flex-col">
                                                    <div className=' flex items-center'>
                                                        <Label htmlFor="gstOtp" className="text-sm font-bold py-2 px-3">Gst Otp</Label>
                                                        <TooltipWithText text="Gst Otp" />
                                                    </div>
                                                    <Input id="gstOtp" className=' rounded-none py-6' type='text' placeholder="Gst Otp" name="address" value={formData.gstOtp} onChange={handleChange} />
                                                </div>

                                                <div className="flex flex-col">
                                                    <div className='flex items-center'>
                                                        <Label htmlFor="isActive" className="text-sm font-bold py-2 px-3">Is Active</Label>
                                                        <span className=' text-red-600 pr-3'>*</span>
                                                        <TooltipWithText text="Is Active" />
                                                    </div>
                                                    <Input id="isActive" className='rounded-none h-5 w-5 ml-3 mt-2' type="checkbox" name="isActive" checked={formData.isActive} onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })} />
                                                    {errors.isActiveError && <p className='text-red-600 text-xs py-5 pl-3'>{errors.isActiveError}</p>}
                                                </div>

                                                <div className="flex flex-col">
                                                    <div className='flex items-center'>
                                                        <Label htmlFor="isAdmin" className="text-sm font-bold py-2 px-3">Is Admin</Label>
                                                        <span className=' text-red-600 pr-3'>*</span>
                                                        <TooltipWithText text="Is Admin" />
                                                    </div>
                                                    <Input id="isAdmin" className='rounded-none h-5 w-5 ml-3 mt-2' type="checkbox" name="isAdmin" checked={formData.isAdmin} onChange={(e) => setFormData({ ...formData, isAdmin: e.target.checked })} />
                                                    {errors.isAdminError && <p className='text-red-600 text-xs py-5 pl-3'>{errors.isAdminError}</p>}
                                                </div>
                                            </div>

                                            <div className="grid gap-2 lg:grid-cols-3 md:grid-cols-1 sm:grid-cols-1 pb-5 ">
                                                <div className="flex flex-col">
                                                    <div className=' flex items-center'>
                                                        <Label htmlFor="hasImpersonateAccess" className="text-sm font-bold py-2 px-3">Has Impersonate Access</Label>
                                                        <TooltipWithText text="Has Impersonate Access" />
                                                    </div>
                                                    <Input id="hasImpersonateAccess" className=' rounded-none h-5 w-5 ml-3 mt-2' type="checkbox"
                                                        placeholder="Has Impersonate Access" name="hasImpersonateAccess" checked={formData.hasImpersonateAccess} onChange={(e) => setFormData({ ...formData, hasImpersonateAccess: e.target.checked })} />
                                                </div>

                                                <div className="flex flex-col">
                                                    <div className='flex items-center'>
                                                        <Label htmlFor="photoAttachment" className="text-sm font-bold py-2 px-3">Photo</Label>
                                                        <TooltipWithText text="Photo" />
                                                    </div>
                                                    <FileUploadMain
                                                        onFileUpload={(data) => handleFileUpload(data, 'photoAttachment')}
                                                        uploadFunction={uploadAppUser}
                                                        downloadFunction={downloadFileAppUser}
                                                        multiple={true}
                                                        showImage={true}
                                                        accept=".jpg,.jpeg,.png"
                                                        tokenData={tokendata}
                                                        existingFiles={fileData.photoAttachment}
                                                    />
                                                </div>

                                                <div className="flex flex-col">
                                                    <div className=' flex items-center'>
                                                        <Label htmlFor="role" className="text-sm font-bold py-2 px-3"> Role</Label>
                                                        <span className=' text-red-600 px-3'>*</span>
                                                        <TooltipWithText text="Role" />
                                                    </div>
                                                    <Dropdown
                                                        value={selectedRoles}
                                                        onChange={(e: DropdownChangeEvent) => handleRoleSelect(e.value)}
                                                        options={roles}
                                                        optionLabel="name"
                                                        placeholder="Select a Role"
                                                        filter
                                                        valueTemplate={selectedDropdownTemplate}
                                                        itemTemplate={dropdownOptionTemplate}
                                                        className="w-full md:w-14rem"
                                                    />
                                                    {errors.role && <p className='text-red-600 text-xs py-5 pl-3 '>{errors.role}</p>}
                                                </div>
                                            </div>

                                            <div className="grid gap-2 lg:grid-cols-3 md:grid-cols-1 sm:grid-cols-1 pb-5 ">
                                                <div className="flex flex-col">
                                                    <div className=' flex items-center'>
                                                        <Label htmlFor="publish" className="text-sm font-bold py-2 px-3"> Publish</Label>
                                                        <span className=' text-red-600 px-3'>*</span>
                                                        <TooltipWithText text="Publish" />
                                                    </div>
                                                    <Dropdown
                                                        value={selectedPublishes}
                                                        onChange={(e: DropdownChangeEvent) => handlePublishSelect(e.value)}
                                                        options={publishes}
                                                        optionLabel="name"
                                                        placeholder="Select a Publish"
                                                        filter
                                                        valueTemplate={selectedDropdownTemplate}
                                                        itemTemplate={dropdownOptionTemplate}
                                                        className="w-full md:w-14rem"
                                                    />
                                                    {errors.publish && <p className='text-red-600 text-xs py-5 pl-3 '>{errors.publish}</p>}
                                                </div>

                                                <div className="flex flex-col">
                                                    <div className=' flex items-center'>
                                                        <Label htmlFor="lastLogin" className="text-sm font-bold py-2 px-3">Last Login</Label>
                                                        <TooltipWithText text="Last Login" />
                                                    </div>
                                                    <Input id="lastLogin" className=' rounded-none py-6' type="date" placeholder="Last Login" name="lastLogin" value={formData.lastLogin} onChange={handleChange} />
                                                </div>

                                                <div className="flex flex-col">
                                                    <div className=' flex items-center'>
                                                        <Label htmlFor="defaultLanguage" className="text-sm font-bold py-2 px-3"> DefaultLanguage</Label>
                                                        <TooltipWithText text="DefaultLanguage" />
                                                    </div>
                                                    <Input id="defaultLanguage" className=' rounded-none py-6' type="text" placeholder="DefaultLanguage" name="defaultLanguage" value={formData.defaultLanguage} onChange={handleChange} />
                                                </div>
                                            </div>

                                            <div className="grid gap-2 lg:grid-cols-3 md:grid-cols-1 sm:grid-cols-1 pb-5 ">
                                                <div className="flex flex-col">
                                                    <div className=' flex items-center'>
                                                        <Label htmlFor="isPremiumUser" className="text-sm font-bold py-2 px-3">Is PremiumUser</Label>
                                                        <TooltipWithText text="IsPremiumUser" />
                                                    </div>
                                                    <Input id="isPremiumUser" className=' rounded-none h-5 w-5 ml-3 mt-2' type="checkbox"
                                                        placeholder="IsPremiumUser" name="isPremiumUser" checked={formData.isPremiumUser} onChange={(e) => setFormData({ ...formData, isPremiumUser: e.target.checked })} />
                                                </div>

                                                <div className="flex flex-col">
                                                    <div className=' flex items-center'>
                                                        <Label htmlFor="totalPlot" className="text-sm font-bold py-2 px-3"> TotalPlot</Label>
                                                        <TooltipWithText text="TotalPlot" />
                                                    </div>
                                                    <Input id="totalPlot" className=' rounded-none py-6' type="text" placeholder="TotalPlot" name="totalPlot" value={formData.totalPlot} onChange={handleChange} />
                                                </div>
                                            </div>
                                        </div>
                                    </TabPanel>
                                </TabView>
                            </div>
                        </form>
                    </div>
                </div>

                <div className="fixed bottom-0 w-full bg-white shadow-md mt-10 py-4 px-5">
                    <div className="flex justify-between">
                        {activeIndex === 0 && (
                            <Button
                                type="button"
                                className="bg-green-800 text-white font-semibold text-lg space-x-2"
                                onClick={() => setActiveIndex(activeIndex + 1)}
                                disabled={!isTab1Valid}
                            >
                                <span>Next</span>
                                <IoIosArrowForward size={15} className="text-white" />
                            </Button>
                        )}

                        {(activeIndex === 1 || activeIndex === 2) && (
                            <div className="flex space-x-4">
                                <Button
                                    type="button"
                                    className="bg-gray-50 text-green-800 border-2 border-green-800 font-semibold text-lg flex items-center space-x-2"
                                    onClick={() => setActiveIndex(activeIndex - 1)}
                                >
                                    <IoIosArrowBack size={15} className="text-green-800" />
                                    <span>Previous</span>
                                </Button>
                                <Button
                                    type="button"
                                    className="bg-green-800 text-white font-semibold text-lg flex items-center space-x-2"
                                    onClick={() => setActiveIndex(activeIndex + 1)}
                                >
                                    <span>Next</span>
                                    <IoIosArrowForward size={15} className="text-white" />
                                </Button>
                            </div>
                        )}

                        {activeIndex === 3 && (
                            <div className="flex space-x-4">
                                <Button
                                    type="button"
                                    className="bg-gray-50 text-green-800 border-2 border-green-800 font-semibold text-lg flex items-center space-x-2"
                                    onClick={() => setActiveIndex(activeIndex - 1)}
                                >
                                    <IoIosArrowBack size={15} className="text-green-800" />
                                    <span>Previous</span>
                                </Button>
                                <Button
                                    type="button"
                                    onClick={handleSubmitClick}
                                    className="bg-green-800 text-white font-bold text-lg"
                                    disabled={!isTab4Valid}
                                >
                                    Save <FaSave className="ml-2" />
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div >

            <Dialog open={showDialog} onOpenChange={setShowDialog}>
                <DialogContent className=' flex flex-col justify-center items-center w-[350px]'>
                    <DialogHeader>
                        <DialogTitle>
                            <Image src="https://diw.wazl.in/assets/images/popups/update.jpg" alt='Update Image' width={100} height={100} />
                        </DialogTitle>
                    </DialogHeader>
                    <DialogDescription className=' flex flex-col text-center justify-center items-center'>
                        {appUserData ? "App User Updated" : "App User Added"}
                        <span className=' font-bold text-lg py-2'>Successfully!</span>
                    </DialogDescription>
                    <DialogFooter>
                        <Link href='/admin/appuser/'>  <Button onClick={handleCloseDialog} className=' bg-gray-500 text-white font-bold'>OK</Button></Link>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>

    );
};

export default AppUserMainForm;