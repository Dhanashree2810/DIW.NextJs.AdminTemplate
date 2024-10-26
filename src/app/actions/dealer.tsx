'use server'
import { checkImportStatus, deleteAppUser, DownloadExcelFile, DownloadImportExcelFile, fetchAppUserData, importAppUserData, updateAppUser, uploadAppUser } from "@/services/dealer";
import { verifySession } from "../lib/session";

export async function fetchFunDealer() {
    const token = await verifySession();
    const res = await fetchAppUserData(token);
    return res;
}

export async function deleteFunDealer(data: any) {
    const token = await verifySession();
    const res = await deleteAppUser(data, token);
    return res;
}

export async function downloadExcelDealer() {
    const token = await verifySession();
    const res = await DownloadExcelFile({ form: null }, token);
    return res;
}

export async function updateFunDealer(data: any) {
    const token = await verifySession();
    const res = await updateAppUser(data, token);
    return res;
}

export async function uploadFunDealer(file: File) {
    const token = await verifySession();
    const res = await uploadAppUser(file, token);
    return res;
}

export async function checkImportStatusDealer() {
    const token = await verifySession();
    const res = await checkImportStatus(token);
    return res;
}

export async function importFunDealer(data: any) {
    const token = await verifySession();
    const res = await importAppUserData(data, token);
    return res;
}

export async function downloadImportExcelDealer(data: any) {
    const token = await verifySession();
    const res = await DownloadImportExcelFile(data, token);
    return res;
}