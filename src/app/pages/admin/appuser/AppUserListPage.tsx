"use client";
import React, { useState, useEffect } from "react";
import "primeflex/primeflex.css";
import 'primereact/resources/primereact.min.css';
import 'primereact/resources/themes/saga-blue/theme.css';
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { FilterMatchMode } from "primereact/api";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Tooltip } from "primereact/tooltip";
import { HiEye } from "react-icons/hi";
import { FaEdit, FaPlus } from "react-icons/fa";
import { RiDeleteBinFill, RiRefreshLine } from "react-icons/ri";
import { BiSolidFileExport } from "react-icons/bi";
import { PiFileArrowUpDuotone } from "react-icons/pi";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import img from "@/assets/images/are-you-sure.jpg";
import Link from "next/link";
import successimg from '@/assets/images/confirm-img.svg';
import TableSkeleton from "@/components/custom/TableSkeleton";
import { deleteFunAllUsers, downloadExcelAllUsers, fetchFunAllUsers } from "@/app/actions/appuser";

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
  role: string,
  roleLabel: string,
  publish: string,
  publishLabel: string,
  lastLogin: Date,
}


export default function AppUserListPage(props: any) {
  const [appUsers, setAppUsers] = useState<AppUser[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    id: { value: null, matchMode: FilterMatchMode.CONTAINS },
    createDate: { value: null, matchMode: FilterMatchMode.CONTAINS },
    name: { value: null, matchMode: FilterMatchMode.CONTAINS },
    firstName: { value: null, matchMode: FilterMatchMode.CONTAINS },
    lastName: { value: null, matchMode: FilterMatchMode.CONTAINS },
    mobile: { value: null, matchMode: FilterMatchMode.CONTAINS },
    mobileVerified: { value: null, matchMode: FilterMatchMode.CONTAINS },
    emailId: { value: null, matchMode: FilterMatchMode.CONTAINS },
    emailVerified: { value: null, matchMode: FilterMatchMode.CONTAINS },
    shopName: { value: null, matchMode: FilterMatchMode.CONTAINS },
    password: { value: null, matchMode: FilterMatchMode.CONTAINS },
    code: { value: null, matchMode: FilterMatchMode.CONTAINS },
    state: { value: null, matchMode: FilterMatchMode.CONTAINS },
    district: { value: null, matchMode: FilterMatchMode.CONTAINS },
    address: { value: null, matchMode: FilterMatchMode.CONTAINS },
    addressLine: { value: null, matchMode: FilterMatchMode.CONTAINS },
    verifyShop: { value: null, matchMode: FilterMatchMode.CONTAINS },
    gst: { value: null, matchMode: FilterMatchMode.CONTAINS },
    gstCertificate: { value: null, matchMode: FilterMatchMode.CONTAINS },
    photoShopFront: { value: null, matchMode: FilterMatchMode.CONTAINS },
    visitingCard: { value: null, matchMode: FilterMatchMode.CONTAINS },
    cheque: { value: null, matchMode: FilterMatchMode.CONTAINS },
    gstOtp: { value: null, matchMode: FilterMatchMode.CONTAINS },
    isActive: { value: null, matchMode: FilterMatchMode.CONTAINS },
    isAdmin: { value: null, matchMode: FilterMatchMode.CONTAINS },
    hasImpersonateAccess: { value: null, matchMode: FilterMatchMode.CONTAINS },
    photoAttachment: { value: null, matchMode: FilterMatchMode.CONTAINS },
    role: { value: null, matchMode: FilterMatchMode.CONTAINS },
    publish: { value: null, matchMode: FilterMatchMode.CONTAINS },
    lastLogin: { value: null, matchMode: FilterMatchMode.CONTAINS },
    isPremiumUser: { value: null, matchMode: FilterMatchMode.CONTAINS },
    totalPlot: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
  const [loading, setLoading] = useState(true);
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(10);
  const [totalRecords, setTotalRecords] = useState<number>(0);

  const onPage = (event: any) => {
    setFirst(event.first);
    setRows(event.rows);
  };

  const cols = [
    { header: "Created Date" },
    { header: "Name" },
    { header: "First Name" },
    { header: "Last Name" },
    { header: "Mobile" },
    { header: "Mobile Verified" },
    { header: "Email Id" },
    { header: "Email Verified" },
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
    { header: "GST Otp" },
    { header: "Is Active" },
    { header: "Is Admin" },
    { header: "Photo Attachment" },
    { header: "HasImpersonateAccess" },
    { header: "Role" },
    { header: "Publish" },
    { header: "Last Login" },
    { header: "Is PremiumUser" },
    { header: "TotalPlot" },
  ];

  useEffect(() => {
    getAppUsers();
  }, []);

  const getAppUsers = async () => {
    try {
      setLoading(true);
      const data = await props?.appUserData;
      const sortedData = [...data].sort((a, b) => b.id - a.id);
      setTotalRecords(sortedData.length);
      setAppUsers(sortedData);
    } catch (error) {
      console.error("Failed to fetch app users", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (field: string, value: string) => {
    setFilters({
      ...filters,
      [field]: { value, matchMode: FilterMatchMode.CONTAINS },
    });
  };

  const confirmDeleteAppUser = async () => {
    if (userToDelete) {
      try {
        const success = await deleteFunAllUsers(userToDelete);
        if (success) {
          setAppUsers((prevData) =>
            prevData.filter((user) => user.id !== userToDelete)
          );
        }
      } catch (error) {
        alert("Failed to delete app Users. Please try again later.");
      } finally {
        setIsDialogOpen(false);
        setUserToDelete(null);
        setIsSuccessDialogOpen(true);
        setTimeout(() => {
          setIsSuccessDialogOpen(false);
        }, 2000);
      }
    }
  };

  const deleteAppUserData = (id: string) => {
    setIsDialogOpen(true);
    setUserToDelete(id);
  };

  const exportToExcel = async () => {
    try {
      const excelBlob = await downloadExcelAllUsers();
      const url = window.URL.createObjectURL(new Blob([excelBlob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "AppUsers.xlsx");
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
    } catch (error) {
      console.error("Error exporting to Excel:", error);
    }
  };

  const refreshData = async () => {
    await fetchFunAllUsers();
  };


  const formatDate = (dateString: Date | undefined) => {
    if (!dateString) return "";
    return format(new Date(dateString), "yyyy-MM-dd");
  };

  const applyDateFilter = () => {
    if (startDate && endDate) {
      const filteredData = appUsers.filter((prod) => {
        const ticketDate = new Date(prod.createDate);
        return ticketDate >= startDate && ticketDate <= endDate;
      });
      setAppUsers(filteredData);
    }
  };

  const clearFilters = () => {
    setStartDate(undefined);
    setEndDate(undefined);
    getAppUsers();
  };

  return (
    <>
      <div>
        <Tooltip target=".export-buttons>button" position="bottom" />
        <div className="pb-2">
          <h1 className="font-bold text-2xl">AppUser</h1>
        </div>
        <div>

          <div className="flex justify-between items-center gap-3 border text-sm bg-white border-gray-300 p-2 my-2">
            <div className="flex items-center space-x-2">
              <Button
                type="button"
                className="bg-green-700 p-2"
                title="Add New Banner"
              >
                <Link href="/admin/appuser/add">
                  <FaPlus size={18} fill="white" />
                </Link>
              </Button>
              <Button
                type="button"
                className="bg-green-700 p-2"
                onClick={exportToExcel}
                title="Export to XLS"
              >
                <BiSolidFileExport size={18} fill="white" />
              </Button>
              <Button
                type="button"
                className="bg-sky-400 p-2"
                title="Import"
              >
                <Link href="/admin/appuser/import">
                  <PiFileArrowUpDuotone size={18} fill="white" />
                </Link>
              </Button>
              <Button
                type="button"
                className="bg-yellow-400 p-2"
                onClick={refreshData}
                title="Refresh"
              >
                <RiRefreshLine size={18} fill="white" />
              </Button>
            </div>
            <div className="flex flex-grow">
              <InputText
                type="search"
                className="py-2 w-full border border-gray-300 text-sm rounded-md pl-1"
                placeholder="Global Search"
                onInput={(e) =>
                  handleFilterChange("global", e.currentTarget.value)
                }
              />
            </div>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-[200px] justify-start text-left font-normal",
                    !startDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? (
                    format(startDate, "PPP")
                  ) : (
                    <span>Select start date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-white">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={setStartDate}
                  initialFocus
                  className="border-none custom-calendar"
                />
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-[200px] justify-start text-left font-normal",
                    !endDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? (
                    format(endDate, "PPP")
                  ) : (
                    <span>Select end date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-white">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={setEndDate}
                  initialFocus
                  className="border-none custom-calendar"
                />
              </PopoverContent>
            </Popover>

            <Button
              type="button"
              className="bg-green-700 p-2 text-white font-bold"
              onClick={applyDateFilter}
            >
              Apply
            </Button>

            <Button
              type="button"
              className="bg-green-700 p-2 text-white font-bold"
              onClick={clearFilters}
            >
              Clear All
            </Button>
          </div>
        </div>

        {loading ? (
          <TableSkeleton cols={cols} />
        ) : (
          <DataTable
            scrollable
            scrollHeight="520px"
            value={appUsers}
            dataKey="id"
            showGridlines
            sortMode="multiple"
            filters={filters}
            removableSort
            paginator
            first={first}
            rows={rows}
            rowsPerPageOptions={[5, 10, 25, 50]}
            totalRecords={totalRecords}
            onPage={onPage}
            paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
            currentPageReportTemplate={`Showing ${first + 1} to ${Math.min(first + rows, totalRecords)} of ${totalRecords} entries`}
            emptyMessage="No Records found."
            globalFilterFields={[
              "id",
              "createDate",
              "name",
              "firstName",
              "lastName",
              "mobile",
              "mobileVerified",
              "emailId",
              "emailVerified",
              "shopName",
              "password",
              "code",
              "state",
              "district",
              "address",
              "addressLine",
              "verifyShop",
              "gst",
              "gstCertificate",
              "photoShopFront",
              "visitingCard",
              "cheque",
              "isActive",
              "isAdmin",
              "hasImpersonateAccess",
              "photoAttachment",
              "role",
              "publish",
              "lastLogin",
              "defaultLanguage",
            ]}
            className="p-datatable-gridlines bg-white"
            filterDisplay="row"
            resizableColumns
            loading={loading}
          >
            <Column
              header="Actions"
              headerStyle={{
                backgroundColor: "#333",
                color: "#fff",
                textAlign: "center",
                padding: "0.5rem",
              }}
              body={(rowData: any) =>
                <div className="flex justify-center space-x-2">
                  <Link href={`/admin/appuser/view/${rowData.id}`}>
                    <HiEye className="h-6 w-6 p-1 cursor-pointer text-black border border-transparent rounded-md hover:border-green-700 hover:bg-green-700 hover:text-white transition-all" />
                  </Link>
                  <Link href={`/admin/appuser/edit/${rowData.id}`}>
                    <FaEdit className="h-6 w-6 p-1 cursor-pointer text-black border border-transparent rounded-md hover:border-green-700 hover:bg-green-700 hover:text-white transition-all" />
                  </Link>
                  <RiDeleteBinFill
                    className="h-6 w-6 p-1 cursor-pointer text-black border border-transparent rounded-md hover:border-red-500 hover:bg-red-500 hover:text-white transition-all"
                    onClick={() => deleteAppUserData(rowData.id)}
                  />
                </div>
              }
            />
            <Column
              field="createDate"
              header="Created Date"
              headerStyle={{
                backgroundColor: "#333",
                color: "#fff",
                textAlign: "center",
              }}
              style={{ width: "200px" }}
              filter
              filterElement={
                <InputText
                  className="w-full text-black border border-gray-300 rounded-md p-1 flex"
                  onChange={(e) => handleFilterChange("createDate", e.target.value)}
                  placeholder=""
                />
              }
              filterPlaceholder=""
              sortable
              body={(rowData) => (
                <div className="text-left truncate" title={rowData.createDate}>
                  {formatDate(rowData.createDate)}
                </div>
              )}
            />
            <Column
              field="name"
              header="Name"
              headerStyle={{
                backgroundColor: "#333",
                color: "#fff",
                textAlign: "center",
              }}
              style={{ width: "200px" }}
              filter
              filterElement={
                <InputText
                  className="w-full text-black border border-gray-300 rounded-md p-1 flex flex-grow"
                  onChange={(e) => handleFilterChange("name", e.target.value)}
                  placeholder=""
                />
              }
              filterPlaceholder=""
              sortable
              body={(rowData: any) =>
                <div className="text-left truncate font-medium">
                  <div title={rowData.name}>{rowData.name}</div>
                </div>
              }
            />
            <Column
              field="firstName"
              header="First Name"
              headerStyle={{
                backgroundColor: "#333",
                color: "#fff",
                textAlign: "center",
              }}
              style={{ width: "200px" }}
              filter
              filterElement={
                <InputText
                  className="w-full text-black border border-gray-300 rounded-md p-1 flex flex-grow"
                  onChange={(e) => handleFilterChange("firstName", e.target.value)}
                  placeholder=""
                />
              }
              filterPlaceholder=""
              sortable
              body={(rowData: any) =>
                <div className="text-left truncate font-medium">
                  <div title={rowData.firstName}>{rowData.firstName}</div>
                </div>
              }
            />
            <Column
              field="lastName"
              header="Last Name"
              headerStyle={{
                backgroundColor: "#333",
                color: "#fff",
                textAlign: "center",
              }}
              style={{ width: "200px" }}
              filter
              filterElement={
                <InputText
                  className="w-full text-black border border-gray-300 rounded-md p-1 flex flex-grow"
                  onChange={(e) => handleFilterChange("lastName", e.target.value)}
                  placeholder=""
                />
              }
              filterPlaceholder=""
              sortable
              body={(rowData: any) =>
                <div className="text-left truncate font-medium">
                  <div title={rowData.lastName}>{rowData.lastName}</div>
                </div>
              }
            />
            <Column
              field="mobile"
              header="Mobile"
              headerStyle={{
                backgroundColor: "#333",
                color: "#fff",
                textAlign: "center",
              }}
              style={{ width: "180px" }}
              filter
              filterElement={
                <InputText
                  className="w-full text-black border border-gray-300 rounded-md p-1 flex flex-grow"
                  onChange={(e) => handleFilterChange("mobile", e.target.value)}
                  placeholder=""
                />
              }
              filterPlaceholder=""
              sortable
              body={(rowData: any) =>
                <div className="text-left truncate font-medium">
                  <div title={rowData.mobile}>{rowData.mobile}</div>
                </div>
              }
            />
            <Column
              field="mobileVerified"
              header="Mobile Verified"
              headerStyle={{
                backgroundColor: "#333",
                color: "#fff",
                textAlign: "center",
              }}
              style={{ width: "180px" }}
              filter
              filterElement={
                <InputText
                  className="w-full text-black border border-gray-300 rounded-md p-1 flex flex-grow"
                  onChange={(e) => handleFilterChange("mobileVerified", e.target.value)}
                  placeholder=""
                />
              }
              filterPlaceholder=""
              sortable
              body={(rowData: any) =>
                <div className="text-left truncate font-medium">
                  <div title={rowData.mobileVerified}>{rowData.mobileVerified ? "true" : "false"}</div>
                </div>
              }
            />
            <Column
              field="emailId"
              header="Email Id"
              headerStyle={{
                backgroundColor: "#333",
                color: "#fff",
                textAlign: "center",
              }}
              style={{ width: "180px" }}
              filter
              filterElement={
                <InputText
                  className="w-full text-black border border-gray-300 rounded-md p-1 flex flex-grow"
                  onChange={(e) => handleFilterChange("emailId", e.target.value)}
                  placeholder=""
                />
              }
              filterPlaceholder=""
              sortable
              body={(rowData: any) =>
                <div className="text-left truncate font-medium">
                  <div title={rowData.emailId}>{rowData.emailId}</div>
                </div>
              }
            />
            <Column
              field="emailVerified"
              header="Email Verified"
              headerStyle={{
                backgroundColor: "#333",
                color: "#fff",
                textAlign: "center",
              }}
              style={{ width: "180px" }}
              filter
              filterElement={
                <InputText
                  className="w-full text-black border border-gray-300 rounded-md p-1 flex flex-grow"
                  onChange={(e) => handleFilterChange("emailVerified", e.target.value)}
                  placeholder=""
                />
              }
              filterPlaceholder=""
              sortable
              body={(rowData: any) =>
                <div className="text-left truncate font-medium">
                  <div title={rowData.emailVerified}>{rowData.emailVerified ? "true" : "false"}</div>
                </div>
              }
            />
            <Column
              field="shopName"
              header="Shop Name"
              headerStyle={{
                backgroundColor: "#333",
                color: "#fff",
                textAlign: "center",
              }}
              style={{ width: "180px" }}
              filter
              filterElement={
                <InputText
                  className="w-full text-black border border-gray-300 rounded-md p-1 flex flex-grow"
                  onChange={(e) => handleFilterChange("shopName", e.target.value)}
                  placeholder=""
                />
              }
              filterPlaceholder=""
              sortable
              body={(rowData: any) =>
                <div className="text-left truncate font-medium">
                  <div title={rowData.shopName}>{rowData.shopName}</div>
                </div>
              }
            />
            <Column
              field="password"
              header="Password"
              headerStyle={{
                backgroundColor: "#333",
                color: "#fff",
                textAlign: "center",
              }}
              style={{ width: "180px" }}
              filter
              filterElement={
                <InputText
                  className="w-full text-black border border-gray-300 rounded-md p-1 flex flex-grow"
                  onChange={(e) => handleFilterChange("password", e.target.value)}
                  placeholder=""
                />
              }
              filterPlaceholder=""
              sortable
              body={(rowData: any) =>
                <div className="text-left truncate font-medium">
                  <div title={rowData.password}>{rowData.password}</div>
                </div>
              }
            />
            <Column
              field="pincode"
              header="Pincode"
              headerStyle={{
                backgroundColor: "#333",
                color: "#fff",
                textAlign: "center",
              }}
              style={{ width: "180px" }}
              filter
              filterElement={
                <InputText
                  className="w-full text-black border border-gray-300 rounded-md p-1 flex flex-grow"
                  onChange={(e) => handleFilterChange("pincode", e.target.value)}
                  placeholder=""
                />
              }
              filterPlaceholder=""
              sortable
              body={(rowData: any) =>
                <div className="text-left truncate font-medium">
                  <div title={rowData.pincode}>{rowData.pincode}</div>
                </div>
              }
            />
            <Column
              field="state"
              header="State"
              headerStyle={{
                backgroundColor: "#333",
                color: "#fff",
                textAlign: "center",
              }}
              style={{ width: "180px" }}
              filter
              filterElement={
                <InputText
                  className="w-full text-black border border-gray-300 rounded-md p-1 flex flex-grow"
                  onChange={(e) => handleFilterChange("state", e.target.value)}
                  placeholder=""
                />
              }
              filterPlaceholder=""
              sortable
              body={(rowData: any) =>
                <div className="text-left truncate font-medium">
                  <div title={rowData.state}>{rowData.state}</div>
                </div>
              }
            />
            <Column
              field="district"
              header="District"
              headerStyle={{
                backgroundColor: "#333",
                color: "#fff",
                textAlign: "center",
              }}
              style={{ width: "180px" }}
              filter
              filterElement={
                <InputText
                  className="w-full text-black border border-gray-300 rounded-md p-1 flex flex-grow"
                  onChange={(e) => handleFilterChange("district", e.target.value)}
                  placeholder=""
                />
              }
              filterPlaceholder=""
              sortable
              body={(rowData: any) =>
                <div className="text-left truncate font-medium">
                  <div title={rowData.district}>{rowData.district}</div>
                </div>
              }
            />
            <Column
              field="address"
              header="Address Line 1"
              headerStyle={{
                backgroundColor: "#333",
                color: "#fff",
                textAlign: "center",
              }}
              style={{ width: "180px" }}
              filter
              filterElement={
                <InputText
                  className="w-full text-black border border-gray-300 rounded-md p-1 flex flex-grow"
                  onChange={(e) => handleFilterChange("address", e.target.value)}
                  placeholder=""
                />
              }
              filterPlaceholder=""
              sortable
              body={(rowData: any) =>
                <div className="text-left truncate font-medium">
                  <div title={rowData.address}>{rowData.address}</div>
                </div>
              }
            />
            <Column
              field="addressLine"
              header="Address Line 2"
              headerStyle={{
                backgroundColor: "#333",
                color: "#fff",
                textAlign: "center",
              }}
              style={{ width: "180px" }}
              filter
              filterElement={
                <InputText
                  className="w-full text-black border border-gray-300 rounded-md p-1 flex flex-grow"
                  onChange={(e) => handleFilterChange("addressLine", e.target.value)}
                  placeholder=""
                />
              }
              filterPlaceholder=""
              sortable
              body={(rowData: any) =>
                <div className="text-left truncate font-medium">
                  <div title={rowData.addressLine}>{rowData.addressLine}</div>
                </div>
              }
            />
            <Column
              field="verifyShop"
              header="Verify Shop"
              headerStyle={{
                backgroundColor: "#333",
                color: "#fff",
                textAlign: "center",
              }}
              style={{ width: "180px" }}
              filter
              filterElement={
                <InputText
                  className="w-full text-black border border-gray-300 rounded-md p-1 flex flex-grow"
                  onChange={(e) => handleFilterChange("verifyShop", e.target.value)}
                  placeholder=""
                />
              }
              filterPlaceholder=""
              sortable
              body={(rowData: any) =>
                <div className="text-left truncate font-medium">
                  <div title={rowData.verifyShop}>{rowData.verifyShop}</div>
                </div>
              }
            />
            <Column
              field="gst"
              header="GST Number"
              headerStyle={{
                backgroundColor: "#333",
                color: "#fff",
                textAlign: "center",
              }}
              style={{ width: "180px" }}
              filter
              filterElement={
                <InputText
                  className="w-full text-black border border-gray-300 rounded-md p-1 flex flex-grow"
                  onChange={(e) => handleFilterChange("gst", e.target.value)}
                  placeholder=""
                />
              }
              filterPlaceholder=""
              sortable
              body={(rowData: any) =>
                <div className="text-left truncate font-medium">
                  <div title={rowData.gst}>{rowData.gst}</div>
                </div>
              }
            />
            <Column
              field="gstCertificate"
              header="Gst Certificate"
              headerStyle={{
                backgroundColor: "#333",
                color: "#fff",
                textAlign: "center",
              }}
              style={{ width: "250px" }}
              sortable
              filter
              filterElement={
                <InputText
                  className="w-full text-black border border-gray-300 rounded-md p-1 flex flex-grow"
                  onChange={(e) =>
                    handleFilterChange("gstCertificate", e.target.value)
                  }
                  placeholder=""
                />
              }
              filterPlaceholder=""
              body={(rowData: any) => {
                let fileName = "No attached files";

                try {
                  if (typeof rowData.gstCertificate == "string") {
                    if (rowData.gstCertificate.startsWith("{")) {
                      const imageData = JSON.parse(rowData.gstCertificate);
                      fileName = imageData.fileName || "No attached files";
                    } else if (rowData.gstCertificate.startsWith("[")) {
                      const imageData = JSON.parse(rowData.gstCertificate);
                      if (Array.isArray(imageData) && imageData.length > 0) {
                        fileName = imageData[0].fileName || "No attached files";
                      }
                    } else {
                      fileName = rowData.gstCertificate || "No attached files";
                    }
                  }
                } catch (e) {
                  console.error("Error parsing image data:", e);
                }

                return (
                  <div className="text-left truncate font-medium" title={fileName}>
                    {fileName}
                  </div>
                );
              }}
            />
            <Column
              field="photoShopFront"
              header="PhotoShopFront"
              headerStyle={{
                backgroundColor: "#333",
                color: "#fff",
                textAlign: "center",
              }}
              style={{ width: "250px" }}
              sortable
              filter
              filterElement={
                <InputText
                  className="w-full text-black border border-gray-300 rounded-md p-1 flex flex-grow"
                  onChange={(e) =>
                    handleFilterChange("photoShopFront", e.target.value)
                  }
                  placeholder=""
                />
              }
              filterPlaceholder=""
              body={(rowData: any) => {
                let fileName = "No attached files";

                try {
                  if (typeof rowData.photoShopFront == "string") {
                    if (rowData.photoShopFront.startsWith("{")) {
                      const imageData = JSON.parse(rowData.photoShopFront);
                      fileName = imageData.fileName || "No attached files";
                    } else if (rowData.photoShopFront.startsWith("[")) {
                      const imageData = JSON.parse(rowData.photoShopFront);
                      if (Array.isArray(imageData) && imageData.length > 0) {
                        fileName = imageData[0].fileName || "No attached files";
                      }
                    } else {
                      fileName = rowData.photoShopFront || "No attached files";
                    }
                  }
                } catch (e) {
                  console.error("Error parsing image data:", e);
                }

                return (
                  <div className="text-left truncate font-medium" title={fileName}>
                    {fileName}
                  </div>
                );
              }}
            />
            <Column
              field="visitingCard"
              header="VisitingCard"
              headerStyle={{
                backgroundColor: "#333",
                color: "#fff",
                textAlign: "center",
              }}
              style={{ width: "250px" }}
              sortable
              filter
              filterElement={
                <InputText
                  className="w-full text-black border border-gray-300 rounded-md p-1 flex flex-grow"
                  onChange={(e) =>
                    handleFilterChange("visitingCard", e.target.value)
                  }
                  placeholder=""
                />
              }
              filterPlaceholder=""
              body={(rowData: any) => {
                let fileName = "No attached files";

                try {
                  if (typeof rowData.visitingCard == "string") {
                    if (rowData.visitingCard.startsWith("{")) {
                      const imageData = JSON.parse(rowData.visitingCard);
                      fileName = imageData.fileName || "No attached files";
                    } else if (rowData.visitingCard.startsWith("[")) {
                      const imageData = JSON.parse(rowData.visitingCard);
                      if (Array.isArray(imageData) && imageData.length > 0) {
                        fileName = imageData[0].fileName || "No attached files";
                      }
                    } else {
                      fileName = rowData.visitingCard || "No attached files";
                    }
                  }
                } catch (e) {
                  console.error("Error parsing image data:", e);
                }

                return (
                  <div className="text-left truncate font-medium" title={fileName}>
                    {fileName}
                  </div>
                );
              }}
            />
            <Column
              field="cheque"
              header="Cheque"
              headerStyle={{
                backgroundColor: "#333",
                color: "#fff",
                textAlign: "center",
              }}
              style={{ width: "250px" }}
              sortable
              filter
              filterElement={
                <InputText
                  className="w-full text-black border border-gray-300 rounded-md p-1 flex flex-grow"
                  onChange={(e) =>
                    handleFilterChange("cheque", e.target.value)
                  }
                  placeholder=""
                />
              }
              filterPlaceholder=""
              body={(rowData: any) => {
                let fileName = "No attached files";

                try {
                  if (typeof rowData.cheque == "string") {
                    if (rowData.cheque.startsWith("{")) {
                      const imageData = JSON.parse(rowData.cheque);
                      fileName = imageData.fileName || "No attached files";
                    } else if (rowData.cheque.startsWith("[")) {
                      const imageData = JSON.parse(rowData.cheque);
                      if (Array.isArray(imageData) && imageData.length > 0) {
                        fileName = imageData[0].fileName || "No attached files";
                      }
                    } else {
                      fileName = rowData.cheque || "No attached files";
                    }
                  }
                } catch (e) {
                  console.error("Error parsing image data:", e);
                }

                return (
                  <div className="text-left truncate font-medium" title={fileName}>
                    {fileName}
                  </div>
                );
              }}
            />
            <Column
              field="gstOtp"
              header="GST OTP"
              headerStyle={{
                backgroundColor: "#333",
                color: "#fff",
                textAlign: "center",
              }}
              style={{ width: "180px" }}
              filter
              filterElement={
                <InputText
                  className="w-full text-black border border-gray-300 rounded-md p-1 flex flex-grow"
                  onChange={(e) => handleFilterChange("gstOtp", e.target.value)}
                  placeholder=""
                />
              }
              filterPlaceholder=""
              sortable
              body={(rowData: any) =>
                <div className="text-left truncate font-medium">
                  <div title={rowData.gstOtp}>{rowData.gstOtp}</div>
                </div>
              }
            />
            <Column
              field="isActive"
              header="Is Active"
              headerStyle={{
                backgroundColor: "#333",
                color: "#fff",
                textAlign: "center",
              }}
              style={{ width: "150px" }}
              filter
              filterElement={
                <InputText
                  className="w-full text-black border border-gray-300 rounded-md p-1 flex flex-grow"
                  onChange={(e) =>
                    handleFilterChange("isActive", e.target.value)
                  }
                  placeholder=""
                />
              }
              filterPlaceholder=""
              sortable
              body={(rowData: any) =>
                <div className="text-left truncate font-medium">
                  <div title={rowData.isActive}>{rowData.isActive ? "true" : "false"}</div>
                </div>
              }
            />
            <Column
              field="isAdmin"
              header="Is Admin"
              headerStyle={{
                backgroundColor: "#333",
                color: "#fff",
                textAlign: "center",
              }}
              style={{ width: "150px" }}
              filter
              filterElement={
                <InputText
                  className="w-full text-black border border-gray-300 rounded-md p-1 flex flex-grow"
                  onChange={(e) =>
                    handleFilterChange("isAdmin", e.target.value)
                  }
                  placeholder=""
                />
              }
              filterPlaceholder=""
              sortable
              body={(rowData: any) =>
                <div className="text-left truncate font-medium">
                  <div title={rowData.isAdmin}>{rowData.isAdmin ? "true" : "false"}</div>
                </div>
              }
            />
            <Column
              field="hasImpersonateAccess"
              header="HasImpersonateAccess"
              headerStyle={{
                backgroundColor: "#333",
                color: "#fff",
                textAlign: "center",
              }}
              style={{ width: "150px" }}
              filter
              filterElement={
                <InputText
                  className="w-full text-black border border-gray-300 rounded-md p-1 flex flex-grow"
                  onChange={(e) =>
                    handleFilterChange("hasImpersonateAccess", e.target.value)
                  }
                  placeholder=""
                />
              }
              filterPlaceholder=""
              sortable
              body={(rowData: any) =>
                <div className="text-left truncate font-medium">
                  <div title={rowData.hasImpersonateAccess}>{rowData.hasImpersonateAccess ? "true" : "false"}</div>
                </div>
              }
            />
            <Column
              field="photoAttachment"
              header="Photo"
              headerStyle={{
                backgroundColor: "#333",
                color: "#fff",
                textAlign: "center",
              }}
              style={{ width: "250px" }}
              sortable
              filter
              filterElement={
                <InputText
                  className="w-full text-black border border-gray-300 rounded-md p-1 flex flex-grow"
                  onChange={(e) =>
                    handleFilterChange("photoAttachment", e.target.value)
                  }
                  placeholder=""
                />
              }
              filterPlaceholder=""
              body={(rowData: any) => {
                let fileName = "No attached files";

                try {
                  if (typeof rowData.photoAttachment == "string") {
                    if (rowData.photoAttachment.startsWith("{")) {
                      const imageData = JSON.parse(rowData.photoAttachment);
                      fileName = imageData.fileName || "No attached files";
                    } else if (rowData.photoAttachment.startsWith("[")) {
                      const imageData = JSON.parse(rowData.photoAttachment);
                      if (Array.isArray(imageData) && imageData.length > 0) {
                        fileName = imageData[0].fileName || "No attached files";
                      }
                    } else {
                      fileName = rowData.photoAttachment || "No attached files";
                    }
                  }
                } catch (e) {
                  console.error("Error parsing image data:", e);
                }

                return (
                  <div className="text-left truncate font-medium" title={fileName}>
                    {fileName}
                  </div>
                );
              }}
            />
            <Column
              field="role"
              header="Role"
              headerStyle={{
                backgroundColor: "#333",
                color: "#fff",
                textAlign: "center",
              }}
              style={{ width: "250px" }}
              filter
              filterElement={
                <InputText
                  className="w-full text-black border border-gray-300 rounded-md p-1 flex flex-grow"
                  onChange={(e) =>
                    handleFilterChange("role", e.target.value)
                  }
                  placeholder=""
                />
              }
              filterPlaceholder=""
              sortable
              body={(rowData: any) =>
                <div className="text-left truncate font-medium">
                  <div title={rowData.role}>
                    {rowData.role}
                  </div>
                </div>
              }
            />
            <Column
              field="publish"
              header="Publish"
              headerStyle={{
                backgroundColor: "#333",
                color: "#fff",
                textAlign: "center",
              }}
              style={{ width: "250px" }}
              filter
              filterElement={
                <InputText
                  className="w-full text-black border border-gray-300 rounded-md p-1 flex flex-grow"
                  onChange={(e) =>
                    handleFilterChange("publish", e.target.value)
                  }
                  placeholder=""
                />
              }
              filterPlaceholder=""
              sortable
              body={(rowData: any) =>
                <div className="text-left truncate font-medium">
                  <div title={rowData.publish}>
                    {rowData.publish}
                  </div>
                </div>
              }
            />
            <Column
              field="lastLogin"
              header="Last Login"
              headerStyle={{
                backgroundColor: "#333",
                color: "#fff",
                textAlign: "center",
              }}
              style={{ width: "200px" }}
              filter
              filterElement={
                <InputText
                  className="w-full text-black border border-gray-300 rounded-md p-1 flex flex-grow"
                  onChange={(e) => handleFilterChange("lastLogin", e.target.value)}
                  placeholder=""
                />
              }
              filterPlaceholder=""
              sortable
              body={(rowData) => (
                <div className="text-left truncate" title={rowData.lastLogin}>
                  {formatDate(rowData.lastLogin)}
                </div>
              )}
            />
            <Column
              field="defaultLanguage"
              header="Default Language"
              headerStyle={{
                backgroundColor: "#333",
                color: "#fff",
                textAlign: "center",
              }}
              style={{ width: "250px" }}
              filter
              filterElement={
                <InputText
                  className="w-full text-black border border-gray-300 rounded-md p-1 flex flex-grow"
                  onChange={(e) =>
                    handleFilterChange("defaultLanguage", e.target.value)
                  }
                  placeholder=""
                />
              }
              filterPlaceholder=""
              sortable
              body={(rowData: any) =>
                <div className="text-left truncate font-medium">
                  <div title={rowData.defaultLanguage}>
                    {rowData.defaultLanguage}
                  </div>
                </div>
              }
            />
            <Column
              field="isPremiumUser"
              header="Is PremiumUser"
              headerStyle={{
                backgroundColor: "#333",
                color: "#fff",
                textAlign: "center",
              }}
              style={{ width: "250px" }}
              filter
              filterElement={
                <InputText
                  className="w-full text-black border border-gray-300 rounded-md p-1 flex flex-grow"
                  onChange={(e) =>
                    handleFilterChange("isPremiumUser", e.target.value)
                  }
                  placeholder=""
                />
              }
              filterPlaceholder=""
              sortable
              body={(rowData: any) =>
                <div className="text-left truncate font-medium">
                  <div title={rowData.isPremiumUser}>
                    {rowData.isPremiumUser ? "true" : "false"}
                  </div>
                </div>
              }
            />
            <Column
              field="totalPlot"
              header="TotalPlot"
              headerStyle={{
                backgroundColor: "#333",
                color: "#fff",
                textAlign: "center",
              }}
              style={{ width: "250px" }}
              filter
              filterElement={
                <InputText
                  className="w-full text-black border border-gray-300 rounded-md p-1 flex flex-grow"
                  onChange={(e) =>
                    handleFilterChange("totalPlot", e.target.value)
                  }
                  placeholder=""
                />
              }
              filterPlaceholder=""
              sortable
              body={(rowData: any) =>
                <div className="text-left truncate font-medium">
                  <div title={rowData.totalPlot}>
                    {rowData.totalPlot}
                  </div>
                </div>
              }
            />
          </DataTable>
        )}

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="p-0 max-w-sm mx-auto bg-white rounded-lg shadow-lg">
            <div className="flex justify-between items-center  border-b">
              <button
                onClick={() => setIsDialogOpen(false)}
                className="text-white hover:text-gray-700 rounded-full bg-red-700"
              >
                <i className="ri-close-fill text-xl"></i>
              </button>
            </div>
            <div className="flex flex-col items-center p-6">
              <Image
                src={img.src}
                alt="Delete Record?"
                width={96}
                height={96}
                className="object-cover   mb-4"
              />
              <div className="text-center">
                <h2 className="text-lg font-semibold mb-2">Are you sure?</h2>
                <p className="text-gray-600 mb-4">
                  Are you sure you want to delete this record? Action will not
                  reverse once confirmed.
                </p>

                <div className="flex justify-between w-full">
                  <Button
                    type="button"
                    onClick={confirmDeleteAppUser}
                    className="bg-red-600 text-white p-2 rounded-md "
                  >
                    Yes, Delete Record
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setIsDialogOpen(false)}
                    className="  text-white p-2 rounded-md bg-green-600"
                  >
                    No, I want to keep Record
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={isSuccessDialogOpen} onOpenChange={setIsSuccessDialogOpen}>
          <DialogContent className="p-0 max-w-sm mx-auto bg-white rounded-lg shadow-lg">
            <div className="flex justify-between items-center border-b">
              <button
                onClick={() => setIsSuccessDialogOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <i className="ri-close-fill text-xl"></i>
              </button>
            </div>
            <div className="flex flex-col items-center p-6">
              <Image
                src={successimg.src}
                alt="Record Deleted success"
                width={96}
                height={96}
                className="object-cover mb-4"
              />
              <div className="text-center">
                <h2 className="text-lg font-semibold mb-2">Record Deleted Successfully</h2>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}