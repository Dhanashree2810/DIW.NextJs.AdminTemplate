'use server'
import { addAppUser, checkImportStatus, deleteAppUser, DownloadExcelFile, DownloadImportExcelFile, fetchAppUsers, fileUploadAppUser, importAppUserData, updateAppUser, uploadAppUser } from "@/services/appusers";
import { verifySession } from "../lib/session";

export async function fetchFunAllUsers() {
    const token = await verifySession();
    const res = await fetchAppUsers(token);
    return res;
}

export async function deleteFunAllUsers(data: any) {
    const token = await verifySession();
    const res = await deleteAppUser(data, token);
    return res;
}

export async function downloadExcelAllUsers() {
    const token = await verifySession();
    const res = await DownloadExcelFile({ form: null }, token);
    return res;
}

export async function addFunAllUsers(data: any) {
    const token = await verifySession();
    const res = await addAppUser(data, token);
    return res;
}

export async function updateFunAllUsers(data: any) {
    const token = await verifySession();
    const res = await updateAppUser(data, token);
    return res;
}

export async function uploadFunAllUsers(file: File) {
    const token = await verifySession();
    const res = await fileUploadAppUser(file, token);
    return res;
}

export async function checkImportStatusAllUsers() {
    const token = await verifySession();
    const res = await checkImportStatus(token);
    return res;
}

export async function importFunAllUsers(data: any) {
    const token = await verifySession();
    const res = await importAppUserData(data, token);
    return res;
}

export async function downloadImportExcelFileAppUser(data: any) {
    const token = await verifySession();
    const res = await DownloadImportExcelFile(data, token);
    return res;
}