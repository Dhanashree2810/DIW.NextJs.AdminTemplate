"use client";
import React, { useEffect, useRef, useState } from 'react';
import "primeflex/primeflex.css";
import 'primereact/resources/themes/saga-blue/theme.css';
import { RiFileDownloadFill, RiEyeFill } from 'react-icons/ri';
import { RiDeleteBin6Fill } from "react-icons/ri";
import { format } from 'date-fns';
import TableSkeleton from '@/components/custom/TableSkeleton';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { checkImportStatus, DownloadImportExcelFile, fileUploadAppUser, importAppUserData } from '@/services/appusers';
import { HiArrowLongLeft } from 'react-icons/hi2';
import Link from 'next/link';


interface DownloadPayload {
  rowsCount: number;
  needSampleData: string;
}

interface AppUser {
  createDate: Date,
  id: string,
  name: string,
  firstName: string,
  lastName: string,
  mobile: string,
  mobileVerified: boolean,
  emailId: string,
  emailVerified: boolean,
  password: string,
  state: string,
  district: string,
  isActive: true,
  isAdmin: boolean,
  photoAttachment: string,
  hasImpersonateAccess: boolean,
  role: string,
  roleLabel: string,
  publish: string,
  publishLabel: string,
  lastLogin: Date,
}

const AppUserImportPage = ({ tokendata }: any) => {
  const [uploadFile, setUploadFile] = useState<any>(null);
  const [errors, setErrors] = useState<{ importFile: string }>({ importFile: '' });
  const [downloading, setDownloading] = useState<boolean>(false);
  const [showTable, setShowTable] = useState<boolean>(false);
  const [appUsers, setappUsers] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef<any>(null);
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(10);
  const [totalRecords, setTotalRecords] = useState<number>(0);


  const onPage = (event: any) => {
    setFirst(event.first);
    setRows(event.rows);
  };

  const cols = [
    { header: "Import Action" },
    { header: "Import Remark" },
    { header: "Created Date" },
    { header: "Name" },
    { header: "Mobile" },
    { header: "Mobile Verified" },
    { header: "Email Id" },
    { header: "Email Verified" },
    { header: "Is Active" },
    { header: "Is Admin" },
    { header: "Shop Name" },
    { header: "Password" },
    { header: "Pincode" },
    { header: "State" },
    { header: "District" },
    { header: "Address Line 1" },
    { header: "Address Line 2" },
    { header: "Verify Shop" },
    { header: "GST Number" },
    { header: "GstCertificate" },
    { header: "PhotoShopFront" },
    { header: "VisitingCard" },
    { header: "Cheque" },
    { header: "Photo Attachment" },
    { header: "HasImpersonateAccess" },
    { header: "Role" },
    { header: "Publish" },
    { header: "Last Login" },
  ];

  useEffect(() => {
    const fetchImportStatus = async () => {
      try {
        const status = await checkImportStatus(tokendata);
        console.log('Import check status:', status);
      } catch (error) {
        console.error('Error checking import status:', error);
      }
    };

    fetchImportStatus();
  }, []);


  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];

      try {
        const uploadedImage = await fileUploadAppUser(file, tokendata);
        setUploadFile(uploadedImage);
      } catch (error) {
        console.error("Error uploading:", error);
      }
    }
  };


  const handleDeleteFile = () => {
    setUploadFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setShowTable(false);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!uploadFile) {
      setErrors({ importFile: 'Import File is required!' });
    } else {
      setErrors({ importFile: '' });

      setLoading(true);
      setShowTable(true);

      try {
        const importResponse = await importAppUserData(uploadFile, tokendata);

        if (importResponse && importResponse.length > 0) {
          setappUsers(importResponse);
          setTotalRecords(importResponse.length);
        } else {
          console.warn('No data found in import response');
          setappUsers([]);
          setTotalRecords(0);
        }
      } catch (error) {
        console.error('Error during file upload or data import:', error);
        setappUsers([]);
        setTotalRecords(0);
      }
      finally {
        setLoading(false);
      }
    }
  };

  const handleDownloadTemplate = async (isSample: boolean) => {
    setDownloading(true);
    try {
      const payload: DownloadPayload = {
        "rowsCount": 50,
        "needSampleData": isSample ? "sample" : ""
      };

      const response = await DownloadImportExcelFile(payload, tokendata);

      const url = window.URL.createObjectURL(new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'appUsers.xlsx');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading file:', error);
    } finally {
      setDownloading(false);
    }
  };

  const renderBodyCell = (rowData: any, field: string) => (
    <div className=" truncate" title={rowData[field]}>{rowData[field]}</div>
  );

  const renderBooleanCell = (value: boolean) => (
    <div className="truncate" title={value ? 'Yes' : 'No'}>{value ? 'Yes' : 'No'}</div>
  );

  const renderDateCell = (date: Date | string | null | undefined) => {
    if (!date) {
      return <div className="truncate"></div>;
    }

    try {
      const formattedDate = format(new Date(date), 'dd-MM-yyyy');
      return (
        <div className="truncate" title={formattedDate}>
          {formattedDate}
        </div>
      );
    } catch (error) {
      console.error('Error formatting date:', error);
      return <div className="truncate">Invalid date</div>;
    }
  };

  const renderFileCell = (rowData: any, field: string) => {
    let fileName = "No attached files";

    try {
      const fieldData = rowData[field];

      if (typeof fieldData === "string") {
        if (fieldData.startsWith("{")) {
          const imageData = JSON.parse(fieldData);
          fileName = imageData.fileName || "No attached files";
        } else if (fieldData.startsWith("[")) {
          const imageData = JSON.parse(fieldData);
          if (Array.isArray(imageData) && imageData.length > 0) {
            fileName = imageData[0].fileName || "No attached files";
          }
        } else {
          fileName = fieldData || "No attached files";
        }
      }
    } catch (e) {
      console.error("Error parsing file data:", e);
    }

    return (
      <div className="text-left truncate font-medium" title={fileName}>
        {fileName}
      </div>
    );
  };

  return (
    <div className="relative h-screen flex flex-col">
      <div className="flex items-center">
        <Link href="/admin/appuser/">
          <HiArrowLongLeft className=" h-9 w-9 cursor-pointer mr-5" />
        </Link>
        <h1 className="uppercase text-sm font-bold">Back to Farmer</h1>
      </div>

      <div className="flex flex-col h-full overflow-y-auto mb-20">
        <div className="flex flex-wrap lg:flex-nowrap gap-x-8">
          <div className="flex flex-col items-center justify-center w-full bg-gray-100">
            <div className="w-full p-2">
              <div className="flex flex-wrap lg:flex-nowrap gap-x-8">
                <div className="w-full lg:w-7/12 xl:w-8/12 mb-4 bg-white rounded-sm p-6 flex-grow">
                  <form onSubmit={handleSubmit} noValidate>
                    <div className="grid gap-10 lg:grid-cols-2 md:grid-cols-1 sm:grid-cols-1 pb-5">
                      <div className="flex flex-col">
                        <div className="flex items-center">
                          <label htmlFor="importFile" className="text-sm font-bold py-2">
                            Import File
                          </label>
                          <span className="text-red-600 px-3">*</span>
                        </div>
                        <div className="flex items-center space-x-4">
                          <input
                            id="importFile"
                            className="border rounded p-2 w-full"
                            accept=".xlsx"
                            type="file"
                            ref={fileInputRef}
                            name="importFile"
                            onChange={handleFileChange}
                          />
                          {uploadFile && (
                            <RiDeleteBin6Fill
                              className="text-red-500 h-5 w-5 cursor-pointer"
                              onClick={handleDeleteFile}
                            />
                          )}
                        </div>
                        {errors.importFile && (
                          <p className="text-red-600 text-xs mt-1">
                            {errors.importFile}
                          </p>
                        )}
                      </div>

                      <div className="flex flex-col justify-center items-center">
                        <button
                          type="submit"
                          className={`btn btn-primary py-2 px-4 rounded flex items-center mt-8 gap-2 ${uploadFile
                            ? 'bg-green-700 text-white border-green-700'
                            : 'bg-gray-500 text-gray-200 opacity-50 cursor-not-allowed'
                            }`}
                          disabled={!uploadFile}
                        >
                          <RiEyeFill />
                          Preview
                        </button>
                      </div>
                    </div>
                  </form>
                </div>

                <div className="w-full lg:w-5/12 xl:w-4/12 flex-grow">
                  <h2 className="text-2xl font-bold mb-4">Download Files</h2>
                  <div className="downloadBtns mb-4 flex flex-col gap-2">
                    <button
                      onClick={() => handleDownloadTemplate(false)}
                      className="btn btn-success bg-green-700 text-white py-2 px-4 rounded flex items-center font-bold gap-2"
                      disabled={downloading}
                    >
                      <RiFileDownloadFill />
                      {downloading ? 'Downloading...' : 'Download Empty Template File'}
                    </button>
                    <button
                      onClick={() => handleDownloadTemplate(true)}
                      className="btn btn-info bg-blue-500 text-white py-2 px-4 rounded flex items-center font-bold gap-2"
                      disabled={downloading}
                    >
                      <RiFileDownloadFill />
                      {downloading ? 'Downloading...' : 'Download Sample Template File'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {showTable && (
          <div className="bg-white border-gray-300 rounded-md p-2 mt-10 ">
            {loading || appUsers.length === 0 ? (
              <TableSkeleton cols={cols} />
            ) : (
              <DataTable
                value={appUsers}
                resizableColumns
                scrollable
                scrollHeight="520px"
                dataKey="id"
                showGridlines
                paginator
                rowsPerPageOptions={[5, 10, 25, 50]}
                first={first}
                rows={rows}
                totalRecords={totalRecords}
                onPage={onPage}
                paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                currentPageReportTemplate={`Showing ${first + 1} to ${Math.min(first + rows, totalRecords)} of ${totalRecords} entries`}
                emptyMessage="No Records found."
                className="p-datatable-gridlines bg-white"
                loading={loading}
              >
                <Column field="importAction" header="Import Action" headerStyle={{ backgroundColor: "#333", color: "#fff", textAlign: "center", }} style={{ width: "200px" }} body={(data) => renderBodyCell(data, 'importAction')} sortable headerClassName="custom-header" bodyClassName="text-left" />
                <Column field="importRemark" header="Import Remark" headerStyle={{ backgroundColor: "#333", color: "#fff", textAlign: "center", }} style={{ width: "200px" }} body={(data) => renderBodyCell(data, 'importRemark')} sortable headerClassName="custom-header" bodyClassName="text-left" />
                <Column field="createDate" header="Created Date" headerStyle={{ backgroundColor: "#333", color: "#fff", textAlign: "center", }} style={{ width: "200px" }} body={(data) => renderDateCell(data.createDate)} sortable headerClassName="custom-header" bodyClassName="text-left" />
                <Column field="name" header="Name" headerStyle={{ backgroundColor: "#333", color: "#fff", textAlign: "center", }} style={{ width: "200px" }} body={(data) => renderBodyCell(data, 'name')} sortable headerClassName="custom-header" bodyClassName="text-left" />
                <Column field="firstName" header="First Name" headerStyle={{ backgroundColor: "#333", color: "#fff", textAlign: "center", }} style={{ width: "200px" }} body={(data) => renderBodyCell(data, 'firstName')} sortable headerClassName="custom-header" bodyClassName="text-left" />
                <Column field="lastName" header="Last Name" headerStyle={{ backgroundColor: "#333", color: "#fff", textAlign: "center", }} style={{ width: "200px" }} body={(data) => renderBodyCell(data, 'lastName')} sortable headerClassName="custom-header" bodyClassName="text-left" />
                <Column field="mobile" header="Mobile" headerStyle={{ backgroundColor: "#333", color: "#fff", textAlign: "center", }} style={{ width: "200px" }} body={(data) => renderBodyCell(data, 'mobile')} sortable headerClassName="custom-header" bodyClassName="text-left" />
                <Column field="mobileVerified" header="Mobile Verified" headerStyle={{ backgroundColor: "#333", color: "#fff", textAlign: "center", }} style={{ width: "200px" }} body={(data) => renderBooleanCell(data.mobileVerified)} sortable headerClassName="custom-header" bodyClassName="text-left" />
                <Column field="emailId" header="Email Id" headerStyle={{ backgroundColor: "#333", color: "#fff", textAlign: "center", }} style={{ width: "200px" }} body={(data) => renderBodyCell(data, 'emailId')} sortable headerClassName="custom-header" bodyClassName="text-left" />
                <Column field="emailVerified" header="Email Verified" headerStyle={{ backgroundColor: "#333", color: "#fff", textAlign: "center", }} style={{ width: "200px" }} body={(data) => renderBooleanCell(data.emailVerified)} sortable headerClassName="custom-header" bodyClassName="text-left" />
                <Column field="shopName" header="Shop Name" headerStyle={{ backgroundColor: "#333", color: "#fff", textAlign: "center", }} style={{ width: "200px" }} body={(data) => renderBodyCell(data, 'shopName')} sortable headerClassName="custom-header" bodyClassName="text-left" />
                <Column field="password" header="Password" headerStyle={{ backgroundColor: "#333", color: "#fff", textAlign: "center", }} style={{ width: "200px" }} body={(data) => renderBodyCell(data, 'password')} sortable headerClassName="custom-header" bodyClassName="text-left" />
                <Column field="pincode" header="Pincode" headerStyle={{ backgroundColor: "#333", color: "#fff", textAlign: "center", }} style={{ width: "200px" }} body={(data) => renderBodyCell(data, 'pincode')} sortable headerClassName="custom-header" bodyClassName="text-left" />
                <Column field="state" header="State" headerStyle={{ backgroundColor: "#333", color: "#fff", textAlign: "center", }} style={{ width: "200px" }} body={(data) => renderBodyCell(data, 'state')} sortable headerClassName="custom-header" bodyClassName="text-left" />
                <Column field="district" header="District" headerStyle={{ backgroundColor: "#333", color: "#fff", textAlign: "center", }} style={{ width: "200px" }} body={(data) => renderBodyCell(data, 'district')} sortable headerClassName="custom-header" bodyClassName="text-left" />
                <Column field="address" header="Address Line 1" headerStyle={{ backgroundColor: "#333", color: "#fff", textAlign: "center", }} style={{ width: "200px" }} body={(data) => renderBodyCell(data, 'address')} sortable headerClassName="custom-header" bodyClassName="text-left" />
                <Column field="addressLine" header="Address Line 2" headerStyle={{ backgroundColor: "#333", color: "#fff", textAlign: "center", }} style={{ width: "200px" }} body={(data) => renderBodyCell(data, 'addressLine')} sortable headerClassName="custom-header" bodyClassName="text-left" />
                <Column field="verifyShop" header="Verify Shop" headerStyle={{ backgroundColor: "#333", color: "#fff", textAlign: "center", }} style={{ width: "200px" }} body={(data) => renderBodyCell(data, 'verifyShop')} sortable headerClassName="custom-header" bodyClassName="text-left" />
                <Column field="gst" header="GST" headerStyle={{ backgroundColor: "#333", color: "#fff", textAlign: "center", }} style={{ width: "200px" }} body={(data) => renderBodyCell(data, 'gst')} sortable headerClassName="custom-header" bodyClassName="text-left" />
                <Column field="gstCertificate" header="GST Certificate" headerStyle={{ backgroundColor: "#333", color: "#fff", textAlign: "center", }} style={{ width: "200px" }} body={(data) => renderFileCell(data, 'gstCertificate')} sortable headerClassName="custom-header" bodyClassName="text-left" />
                <Column field="photoShopFront" header="Photo Shop From Front" headerStyle={{ backgroundColor: "#333", color: "#fff", textAlign: "center", }} style={{ width: "200px" }} body={(data) => renderFileCell(data, 'photoShopFront')} sortable headerClassName="custom-header" bodyClassName="text-left" />
                <Column field="visitingCard" header="Visiting Card" headerStyle={{ backgroundColor: "#333", color: "#fff", textAlign: "center", }} style={{ width: "200px" }} body={(data) => renderFileCell(data, 'visitingCard')} sortable headerClassName="custom-header" bodyClassName="text-left" />
                <Column field="cheque" header="Cheque" headerStyle={{ backgroundColor: "#333", color: "#fff", textAlign: "center", }} style={{ width: "200px" }} body={(data) => renderFileCell(data, 'cheque')} sortable headerClassName="custom-header" bodyClassName="text-left" />
                <Column field=" gstOTP" header="GST OTP" headerStyle={{ backgroundColor: "#333", color: "#fff", textAlign: "center", }} style={{ width: "200px" }} body={(data) => renderBodyCell(data, 'gstOTP')} sortable headerClassName="custom-header" bodyClassName="text-left" />
                <Column field="hasImpersonateAccess" header="HasImpersonateAccess" headerStyle={{ backgroundColor: "#333", color: "#fff", textAlign: "center", }} style={{ width: "200px" }} body={(data) => renderBooleanCell(data.hasImpersonateAccess)} sortable headerClassName="custom-header" bodyClassName="text-left" />
                <Column field="photoAttachment" header="Photo" headerStyle={{ backgroundColor: "#333", color: "#fff", textAlign: "center", }} style={{ width: "200px" }} body={(data) => renderFileCell(data, 'photoAttachment')} sortable headerClassName="custom-header" bodyClassName="text-left" />
                <Column field="isActive" header="Is Active" headerStyle={{ backgroundColor: "#333", color: "#fff", textAlign: "center", }} style={{ width: "200px" }} body={(data) => renderBooleanCell(data.isActive)} sortable headerClassName="custom-header" bodyClassName="text-left" />
                <Column field="isAdmin" header="Is Admin" headerStyle={{ backgroundColor: "#333", color: "#fff", textAlign: "center", }} style={{ width: "200px" }} body={(data) => renderBooleanCell(data.isAdmin)} sortable headerClassName="custom-header" bodyClassName="text-left" />
                <Column field="role" header="Role" headerStyle={{ backgroundColor: "#333", color: "#fff", textAlign: "center", }} style={{ width: "200px" }} body={(data) => renderBodyCell(data, 'role')} sortable headerClassName="custom-header" bodyClassName="text-left" />
                <Column field="publish" header="Publish" headerStyle={{ backgroundColor: "#333", color: "#fff", textAlign: "center", }} style={{ width: "200px" }} body={(data) => renderBodyCell(data, 'publish')} sortable headerClassName="custom-header" bodyClassName="text-left" />
                <Column field="lastLogin" header="Last Login" headerStyle={{ backgroundColor: "#333", color: "#fff", textAlign: "center", }} style={{ width: "200px" }} body={(data) => renderDateCell(data.lastLogin)} sortable headerClassName="custom-header" bodyClassName="text-left" />
                <Column field="defaultLanguage" header="Default Language" headerStyle={{ backgroundColor: "#333", color: "#fff", textAlign: "center", }} style={{ width: "200px" }} body={(data) => renderBodyCell(data, 'defaultLanguage')} sortable headerClassName="custom-header" bodyClassName="text-left" />
                <Column field="isPremiumUser" header="IsPremiumUser" headerStyle={{ backgroundColor: "#333", color: "#fff", textAlign: "center", }} style={{ width: "200px" }} body={(data) => renderBooleanCell(data.isPremiumUser)} sortable headerClassName="custom-header" bodyClassName="text-left" />
                <Column field="totalPlot" header="Total Plot" headerStyle={{ backgroundColor: "#333", color: "#fff", textAlign: "center", }} style={{ width: "200px" }} body={(data) => renderBodyCell(data, 'totalPlot')} sortable headerClassName="custom-header" bodyClassName="text-left" />
              </DataTable>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AppUserImportPage;