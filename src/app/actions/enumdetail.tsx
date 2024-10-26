'use server'
import {  fetchEnumDetailsData } from "@/services/enumdetails";
import { verifySession } from "../lib/session";


export async function fetchFunEnumDet() {
    const token = await verifySession();
    const res = await fetchEnumDetailsData(token);
    return res;
}
