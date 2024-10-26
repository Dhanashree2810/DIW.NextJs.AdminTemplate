"use client";
import React, { useEffect, useState } from "react";
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { TabView, TabPanel } from 'primereact/tabview';
import { format } from 'date-fns';
import TooltipWithText from "@/components/custom/TooltipWithText";
import Link from "next/link";
import { HiArrowLongLeft } from "react-icons/hi2";
import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { FaEdit } from "react-icons/fa";
import ImgViewer from "@/components/custom/ImgViewer ";


const parseImageAndSetPreview = (jsonString: any, setImagePreview: any) => {
  try {
    const imgFiles = JSON.parse(jsonString);
    if (imgFiles && imgFiles.length > 0) {
      const imageUrls = imgFiles.map((imgFile: any) => {
        const correctedFilePath = imgFile.filePath.replace(/\\/g, '/');
        return `${process.env.NEXT_PUBLIC_API_URL}/ImportFiles/${correctedFilePath}`;
      });
      setImagePreview(imageUrls);
    }
  } catch (error) {
    console.error("Failed to parse image URL:", error);
  }
};

export default function AppUsersViewPage(props: any) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    id: '', name: '', firstName: '', lastName: '', mobile: '', mobileVerified: false,
    emailId: '', emailVerified: false, shopName: '', password: '',
    pincode: '', state: '', district: '', address: '', addressLine: '',
    verifyShop: '', gst: '', gstCertificate: null, photoShopFront: null, visitingCard: null, cheque: null, gstOtp: '',
    isActive: false, isAdmin: false, hasImpersonateAccess: false, photoAttachment: null, role: '', publish: '', lastLogin: '',
    defaultLanguage: '', isPremiumUser: false, totalPlot: ''
  });
  const totalTabs = 4;
  const [gstCertificatePreview, setGstCertificatePreview] = useState([]);
  const [photoShopFrontPreview, setPhotoShopFrontPreview] = useState([]);
  const [visitingCardPreview, setVisitingCardPreview] = useState([]);
  const [chequePreview, setChequePreview] = useState([]);
  const [PhotoAttachmentPreview, setPhotoAttachmentPreview] = useState([]);

  useEffect(() => {
    getAppUsersData();
  }, []);

  const getAppUsersData = async () => {
    try {
      const data = props?.appUserData;

      if (data.gstCertificate) {
        parseImageAndSetPreview(data.gstCertificate, setGstCertificatePreview);
      }

      if (data.photoShopFront) {
        parseImageAndSetPreview(data.photoShopFront, setPhotoShopFrontPreview);
      }

      if (data.visitingCard) {
        parseImageAndSetPreview(data.visitingCard, setVisitingCardPreview);
      }

      if (data.cheque) {
        parseImageAndSetPreview(data.cheque, setChequePreview);
      }

      if (data.photoAttachment) {
        parseImageAndSetPreview(data.photoAttachment, setPhotoAttachmentPreview);
      }

      setFormData({
        ...data,
        lastLogin: data.lastLogin ? data.lastLogin.slice(0, 10) : '',
      });

    } catch (error) {
      console.error("Error fetching App Users data:", error);
      setError("Error fetching App Users data.");
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

  return (
    <div className="relative h-screen flex flex-col">
      <div className=" flex items-center pb-2">
        <Link href="/admin/appuser/">
          <HiArrowLongLeft className=" h-9 w-9 cursor-pointer mr-5" />
        </Link>
        <h1 className=" capitalize text-lg font-bold">
          Back to AppUser
        </h1>
      </div>

      {error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <div className="flex flex-col h-full overflow-y-auto border-none mb-28">
          <div className="container mx-auto">
            <div className="w-full">
              <TabView
                activeIndex={activeIndex}
                onTabChange={(e) => setActiveIndex(e.index)}
                className="bg-gray-100 w-full"
                style={{ width: '100%' }}>

                {/* Step 1 */}
                <TabPanel
                  header={
                    <div className="flex justify-center w-full">
                      <div className="flex flex-col items-center flex-1">
                        <div className={getTabClassName(0)}>1</div>
                        <div className={getTabLabelClassName(0)}>Access Details</div>
                      </div>
                    </div>
                  }
                  headerClassName={`flex-1 ${activeIndex === 0 ? '' : 'p-disabled'}`}>
                  <div className="p-5 bg-gray-100">
                    <input type="hidden" name="id" value={formData.id} />
                    <div className="grid gap-2 lg:grid-cols-3 md:grid-cols-1 sm:grid-cols-1 pb-5 ">
                      <div className="flex flex-col bg-white bg-opacity-80 p-5 h-full border border-dark border-opacity-5 rounded-md">
                        <div className="flex items-center space-x-2">
                          <Label htmlFor="name" className="text-sm font-bold py-2">
                            Name
                          </Label>
                          <span className=' text-red-600'>*</span>
                          <TooltipWithText text="Name" />
                        </div>
                        <span className="text-sm font-medium">{formData.name}</span>
                      </div>

                      <div className="flex flex-col bg-white bg-opacity-80 p-5 h-full border border-dark border-opacity-5 rounded-md">
                        <div className="flex items-center space-x-2">
                          <Label htmlFor="firstName" className="text-sm font-bold py-2 ">
                            First Name
                          </Label>
                          <TooltipWithText text="First Name" />
                        </div>
                        <span className="text-sm font-medium">{formData.firstName}</span>
                      </div>

                      <div className="flex flex-col bg-white bg-opacity-80 p-5 h-full border border-dark border-opacity-5 rounded-md">
                        <div className="flex items-center space-x-2">
                          <Label htmlFor="lastName" className="text-sm font-bold py-2 ">
                            Last Name
                          </Label>
                          <TooltipWithText text="Last Name" />
                        </div>
                        <span className="text-sm font-medium">{formData.lastName}</span>
                      </div>
                    </div>

                    <div className="grid gap-2 lg:grid-cols-3 md:grid-cols-1 sm:grid-cols-1 pb-5">
                      <div className="flex flex-col bg-white bg-opacity-80 p-5 h-full border border-dark border-opacity-5 rounded-md">
                        <div className="flex items-center space-x-2">
                          <Label htmlFor="mobile" className="text-sm font-bold py-2">
                            Mobile
                          </Label>
                          <span className=' text-red-600'>*</span>
                          <TooltipWithText text="Mobile" />
                        </div>
                        <span className="text-sm font-medium">{formData.mobile}</span>
                      </div>

                      <div className="flex flex-col bg-white bg-opacity-80 p-5 h-full border border-dark border-opacity-5 rounded-md">
                        <div className="flex items-center space-x-2">
                          <Label htmlFor="mobileVerified" className="text-sm font-bold py-2 ">
                            Mobile Verified
                          </Label>
                          <span className=' text-red-600'>*</span>
                          <TooltipWithText text="Mobile Verified" />
                        </div>
                        <span className="text-sm font-medium">{formData.mobileVerified ? "Yes" : "No"}</span>
                      </div>
                    </div>
                  </div>
                </TabPanel>

                {/* Step 2 */}
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
                  <div className="p-5 bg-gray-100">
                    <div className="grid gap-2 lg:grid-cols-3 md:grid-cols-1 sm:grid-cols-1 pb-5">
                      <div className="flex flex-col bg-white bg-opacity-80 p-5 h-full border border-dark border-opacity-5 rounded-md">
                        <div className="flex items-center space-x-2">
                          <Label htmlFor="emailId" className="text-sm font-bold py-2">
                            Email Id
                          </Label>
                          <TooltipWithText text="Email Id" />
                        </div>
                        <span className="text-sm font-medium">{formData.emailId}</span>
                      </div>

                      <div className="flex flex-col bg-white bg-opacity-80 p-5 h-full border border-dark border-opacity-5 rounded-md">
                        <div className="flex items-center space-x-2">
                          <Label htmlFor="emailVerified" className="text-sm font-bold py-2 ">
                            Email Verified
                          </Label>
                          <TooltipWithText text="Email Verified" />
                        </div>
                        <span className="text-sm font-medium">{formData.emailVerified ? "Yes" : "No"}</span>
                      </div>

                      <div className="flex flex-col bg-white bg-opacity-80 p-5 h-full border border-dark border-opacity-5 rounded-md">
                        <div className="flex items-center space-x-2">
                          <Label htmlFor="shopName" className="text-sm font-bold py-2">
                            Shop Name
                          </Label>
                          <TooltipWithText text="Shop Name" />
                        </div>
                        <span className="text-sm font-medium">{formData.shopName}</span>
                      </div>
                    </div>

                    <div className="grid gap-2 lg:grid-cols-3 md:grid-cols-1 sm:grid-cols-1 pb-5">
                      <div className="flex flex-col bg-white bg-opacity-80 p-5 h-full border border-dark border-opacity-5 rounded-md">
                        <div className="flex items-center space-x-2">
                          <Label htmlFor="password" className="text-sm font-bold py-2">
                            Password
                          </Label>
                          <TooltipWithText text="Password" />
                        </div>
                        <span className="text-sm font-medium">{formData.password}</span>
                      </div>
                    </div>
                  </div>
                </TabPanel>

                {/* Step 3 */}
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
                  <div className="p-5 bg-gray-100">
                    <div className="grid gap-2 lg:grid-cols-3 md:grid-cols-1 sm:grid-cols-1 pb-5">
                      <div className="flex flex-col bg-white bg-opacity-80 p-5 h-full border border-dark border-opacity-5 rounded-md">
                        <div className="flex items-center space-x-2">
                          <Label htmlFor="pincode" className="text-sm font-bold py-2">
                            Pincode
                          </Label>
                          <TooltipWithText text="Pincode" />
                        </div>
                        <span className="text-sm font-medium">{formData.pincode}</span>
                      </div>

                      <div className="flex flex-col bg-white bg-opacity-80 p-5 h-full border border-dark border-opacity-5 rounded-md">
                        <div className="flex items-center space-x-2">
                          <Label htmlFor="state" className="text-sm font-bold py-2">
                            State
                          </Label>
                          <TooltipWithText text="State" />
                        </div>
                        <span className="text-sm font-medium">{formData.state}</span>
                      </div>

                      <div className="flex flex-col bg-white bg-opacity-80 p-5 h-full border border-dark border-opacity-5 rounded-md">
                        <div className="flex items-center space-x-2">
                          <Label htmlFor="district" className="text-sm font-bold py-2">
                            District
                          </Label>
                          <TooltipWithText text="District" />
                        </div>
                        <span className="text-sm font-medium">{formData.district}</span>
                      </div>
                    </div>

                    <div className="grid gap-2 lg:grid-cols-3 md:grid-cols-1 sm:grid-cols-1 pb-5">
                      <div className="flex flex-col bg-white bg-opacity-80 p-5 h-full border border-dark border-opacity-5 rounded-md">
                        <div className="flex items-center space-x-2">
                          <Label htmlFor="address" className="text-sm font-bold py-2">
                            Address Line 1
                          </Label>
                          <TooltipWithText text="Address Line 1" />
                        </div>
                        <span className="text-sm font-medium">{formData.address}</span>
                      </div>

                      <div className="flex flex-col bg-white bg-opacity-80 p-5 h-full border border-dark border-opacity-5 rounded-md">
                        <div className="flex items-center space-x-2">
                          <Label htmlFor="addressLine" className="text-sm font-bold py-2">
                            Address Line 2
                          </Label>
                          <TooltipWithText text="Address Line 2" />
                        </div>
                        <span className="text-sm font-medium">{formData.addressLine}</span>
                      </div>
                    </div>
                  </div>
                </TabPanel>

                {/* Step 4 */}
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
                  <div className="p-5 bg-gray-100">
                    <div className="grid gap-2 lg:grid-cols-3 md:grid-cols-1 sm:grid-cols-1 pb-5">
                      <div className="flex flex-col bg-white bg-opacity-80 p-5 h-full border border-dark border-opacity-5 rounded-md">
                        <div className="flex items-center space-x-2">
                          <Label htmlFor="gst" className="text-sm font-bold py-2">
                            GST Number
                          </Label>
                          <TooltipWithText text="GST Number" />
                        </div>
                        <span className="text-sm font-medium">{formData.gst}</span>
                      </div>

                      <div className="flex flex-col bg-white bg-opacity-80 p-5 h-full border border-dark border-opacity-5 rounded-md overflow-auto ">
                        <div className="flex items-center space-x-2">
                          <Label htmlFor="gstCertificate" className="text-sm font-bold py-2">
                            GstCertificate
                          </Label>
                          <TooltipWithText text="GstCertificate" />
                        </div>
                        <div className="flex gap-5 my-5">
                          {gstCertificatePreview.map((url: string, index: number) => (
                            <ImgViewer imageShowUrl={url} />
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-col bg-white bg-opacity-80 p-5 h-full border border-dark border-opacity-5 rounded-md overflow-auto">
                        <div className="flex items-center space-x-2">
                          <Label htmlFor="photoShopFront" className="text-sm font-bold py-2">
                            Photo Shop From Front
                          </Label>
                          <TooltipWithText text="Photo Shop From Front" />
                        </div>
                        <div className="flex gap-5 my-5">
                          {photoShopFrontPreview.map((url: string, index: number) => (
                            <ImgViewer imageShowUrl={url} />
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="grid gap-2 lg:grid-cols-3 md:grid-cols-1 sm:grid-cols-1 pb-5">
                      <div className="flex flex-col bg-white bg-opacity-80 p-5 h-full border border-dark border-opacity-5 rounded-md overflow-auto">
                        <div className="flex items-center space-x-2">
                          <Label htmlFor="visitingCard" className="text-sm font-bold py-2">
                            VisitingCard
                          </Label>
                          <TooltipWithText text="VisitingCard" />
                        </div>
                        <div className="flex gap-5 my-5">
                          {visitingCardPreview.map((url: string, index: number) => (
                            <ImgViewer imageShowUrl={url} />
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-col bg-white bg-opacity-80 p-5 h-full border border-dark border-opacity-5 rounded-md overflow-auto">
                        <div className="flex items-center space-x-2">
                          <Label htmlFor="cheque" className="text-sm font-bold py-2">
                            Cheque
                          </Label>
                          <TooltipWithText text="Cheque" />
                        </div>
                        <div className="flex gap-5 my-5">
                          {chequePreview.map((url: string, index: number) => (
                            <ImgViewer imageShowUrl={url} />
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-col bg-white bg-opacity-80 p-5 h-full border border-dark border-opacity-5 rounded-md">
                        <div className="flex items-center space-x-2">
                          <Label htmlFor="gstOtp" className="text-sm font-bold py-2">
                            Gst Otp
                          </Label>
                          <TooltipWithText text="Gst Otp" />
                        </div>
                        <span className="text-sm font-medium">{formData.gstOtp}</span>
                      </div>
                    </div>

                    <div className="grid gap-2 lg:grid-cols-3 md:grid-cols-1 sm:grid-cols-1 pb-5">
                      <div className="flex flex-col bg-white bg-opacity-80 p-5 h-full border border-dark border-opacity-5 rounded-md">
                        <div className="flex items-center space-x-2">
                          <Label htmlFor="isActive" className="text-sm font-bold py-2">
                            Active
                          </Label>
                          <span className=' text-red-600'>*</span>
                          <TooltipWithText text="Active" />
                        </div>
                        <span className="text-sm font-medium">{formData.isActive ? "true" : "false"}</span>
                      </div>

                      <div className="flex flex-col bg-white bg-opacity-80 p-5 h-full border border-dark border-opacity-5 rounded-md">
                        <div className="flex items-center space-x-2">
                          <Label htmlFor="isAdmin" className="text-sm font-bold py-2">
                            Is Admin
                          </Label>
                          <span className=' text-red-600'>*</span>
                          <TooltipWithText text="Is Admin" />
                        </div>
                        <span className="text-sm font-medium">{formData.isAdmin ? "true" : "false"}</span>
                      </div>

                      <div className="flex flex-col bg-white bg-opacity-80 p-5 h-full border border-dark border-opacity-5 rounded-md">
                        <div className="flex items-center space-x-2">
                          <Label htmlFor="hasImpersonateAccess" className="text-sm font-bold py-2">
                            Has Impersonate Access
                          </Label>
                          <TooltipWithText text="Has Impersonate Access" />
                        </div>
                        <span className="text-sm font-medium">{formData.hasImpersonateAccess ? "true" : "false"}</span>
                      </div>
                    </div>

                    <div className="grid gap-2 lg:grid-cols-3 md:grid-cols-1 sm:grid-cols-1 pb-5">
                      <div className="flex flex-col bg-white bg-opacity-80 p-5 h-full border border-dark border-opacity-5 rounded-md overflow-auto">
                        <div className="flex items-center space-x-2">
                          <Label htmlFor="photoAttachment" className="text-sm font-bold py-2">
                            Photo
                          </Label>
                          <TooltipWithText text="Photo" />
                        </div>
                        <div className="flex gap-5 my-5">
                          {PhotoAttachmentPreview.map((url: string, index: number) => (
                            <ImgViewer imageShowUrl={url} />
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-col bg-white bg-opacity-80 p-5 h-full border border-dark border-opacity-5 rounded-md">
                        <div className="flex items-center space-x-2">
                          <Label htmlFor="lastLogin" className="text-sm font-bold py-2">
                            Last Login
                          </Label>
                          <TooltipWithText text="Last Login" />
                        </div>
                        <span className="text-sm font-medium">{formData.lastLogin ? format(new Date(formData.lastLogin), 'dd/MM/yyyy') : ''}</span>
                      </div>

                      <div className="flex flex-col bg-white bg-opacity-80 p-5 h-full border border-dark border-opacity-5 rounded-md">
                        <div className="flex items-center space-x-2">
                          <Label htmlFor="defaultLanguage" className="text-sm font-bold py-2">
                            DefaultLanguage
                          </Label>
                          <TooltipWithText text="DefaultLanguage" />
                        </div>
                        <span className="text-sm font-medium">{formData.defaultLanguage}</span>
                      </div>
                    </div>

                    <div className="grid gap-2 lg:grid-cols-3 md:grid-cols-1 sm:grid-cols-1 pb-5 md:pb-20 sm:pb-20">
                      <div className="flex flex-col bg-white bg-opacity-80 p-5 h-full border border-dark border-opacity-5 rounded-md">
                        <div className="flex items-center space-x-2">
                          <Label htmlFor="isPremiumUser" className="text-sm font-bold py-2">
                            IsPremiumUser
                          </Label>
                          <TooltipWithText text="IsPremiumUser" />
                        </div>
                        <span className="text-sm font-medium">{formData.isPremiumUser ? "true" : "false"}</span>
                      </div>

                      <div className="flex flex-col bg-white bg-opacity-80 p-5 h-full border border-dark border-opacity-5 rounded-md">
                        <div className="flex items-center space-x-2">
                          <Label htmlFor="totalPlot" className="text-sm font-bold py-2">
                            TotalPlot
                          </Label>
                          <TooltipWithText text="TotalPlot" />
                        </div>
                        <span className="text-sm font-medium">{formData.totalPlot}</span>
                      </div>
                    </div>
                  </div>
                </TabPanel>
              </TabView>
            </div>
          </div>
        </div>
      )}

      <div className="fixed bottom-0 w-full bg-white shadow-md mt-10 py-4 px-5">
        <div className="flex justify-between">
          {activeIndex === 0 && (
            <Button
              type="button"
              className="bg-green-800 text-white font-semibold text-lg space-x-2"
              onClick={() => setActiveIndex(activeIndex + 1)}
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
              <Link href={`/admin/appuser/edit/${formData.id}`} passHref>
                <Button
                  type="button"
                  className="bg-green-800 text-white font-semibold text-lg flex items-center space-x-2"
                >
                  <FaEdit size={15} className="text-white" />
                  <span>Edit</span>
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}