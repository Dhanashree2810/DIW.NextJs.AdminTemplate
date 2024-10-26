'use server'
import { fetchGetAdminDashboardData } from '@/services/dashboard';
import {  subMonths } from 'date-fns';
import { verifySession } from "../lib/session";

const getWeekNumber = (date: Date) => {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
};

const fetchDashboardData = async () => {
    const previousMonthDate = subMonths(new Date(), 1);
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentWeek = getWeekNumber(currentDate);

    const results: any[] = [];

    const types = [
        { dashboardType: "PRODUCTWISESALES", fromDate: previousMonthDate, toDate: currentDate },
        { dashboardType: "STATEWISESALES", fromDate: previousMonthDate, toDate: currentDate },
        { dashboardType: "ORDERSTATUSREPORT", fromDate: previousMonthDate, toDate: currentDate },
        { dashboardType: "QUATERLYSALESREPORT", year: currentYear },
        { dashboardType: "WEEKLYSALESREPORT", week: currentWeek, year: currentYear },
        { dashboardType: "CUSTOMERACTIVITYREPORT", year: currentYear }
    ];

    for (const type of types) {
        const result = await getDashboardDataDynamically(type);
        results.push({
            dashboardType: type.dashboardType,
            data: result
        });
    }

    return results;
}

const getDashboardDataDynamically = async (item: any) => {
    try {
        const condition = {
            dashboardType: item.dashboardType,
            fromDate: item.fromDate ? item.fromDate : null,
            month: item.month ? item.month : null,
            toDate: item.toDate ? item.toDate : null,
            week: item.week,
            year: item.year,
        };

        const payload = {
            condition: condition,
            form: null
        }
        const tokendata = await verifySession();
        const data = await fetchGetAdminDashboardData(payload,tokendata);

        return data;
       
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
    } finally {
    }
};

export default fetchDashboardData;