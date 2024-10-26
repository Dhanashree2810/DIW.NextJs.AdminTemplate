"use client";
import Image from "next/image";
import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { Ripple } from "primereact/ripple";
import "primeflex/primeflex.css";
import dayjs from 'dayjs';
import * as echarts from 'echarts';
import "primereact/resources/themes/saga-blue/theme.css";
import { FiShoppingBag } from "react-icons/fi";
import { RiCoupon4Fill, RiImageFill, RiMoneyRupeeCircleFill, RiShoppingCartFill, RiUser2Fill } from "react-icons/ri";
import { PiArrowUpRightFill } from "react-icons/pi";
import img from "@/assets/images/product-img.png";
import { Card } from "@/components/ui/card";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { BsTicketPerforated } from "react-icons/bs";
import { MdOutlineFeedback } from "react-icons/md";
import { MdOutlineCurrencyRupee } from "react-icons/md";
import { IoEyeOutline } from "react-icons/io5";
import { MdFullscreen } from "react-icons/md";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import ChartView from "@/components/custom/ChartView";
import { AiOutlineCloseCircle } from "react-icons/ai";

interface DashboardEntity {
  dashboardType: string | null;
  fromDate: Date | null;
  toDate: Date | null;
  year: number | null;
  month: number | null;
  week: number | null;
}

export default function AdvancedCard(props: any) {
  const data = props?.dashboardData;
  const [dashboardData, setDashboardData] = useState(
    {
      statusCount: data?.neworders?.[0]?.statuscount || null,
      orderTimeout: data?.ordertimeout?.[0]?.ordertimeout || null,
      ticketsCount: data?.tickets?.[0]?.ticketcount || null,
      feedbackCount: data?.feedback?.[0]?.feedbackcount || null,
      planAmount: data?.planamount?.[0]?.planrequestcount || null,
      usedCouponCount: data?.couponDetails?.[0]?.usedCouponCount || null,
      totalCouponCount: data?.couponDetails?.[0]?.totalCouponCount || null,
      dealerCount: data?.dealerrequest?.[0]?.dealercount || null,
      products:
        data?.trendingProducts?.map((product: any, index: any) => ({
          rank: index + 1,
          productName: product.productName,
          salesCount: product.salesCount,
          image: product.image || "/assets/images/product-img.png",
        })) || [],
      orders:
        (data?.recentorders || [])
          .filter((order: any) => order.orderStatus === 'Orderplaced')
          .map((order: any) => ({
            id: order.id,
            orderId: order.orderId,
            name: order.name,
            orderStatus: order.orderStatus,
            orderTotalAmt: order.orderTotalAmt,
            orderdate: order.orderdate,
          })) || [],
    }
  );
  const [dashboardEntity, setDashboardEntity] = useState<DashboardEntity>({
    dashboardType: null,
    fromDate: null,
    toDate: null,
    year: null,
    month: null,
    week: null,
  });
  const [chartsDashboardData, setChartsDashboardData] = useState({
    productSales: [],
    stateSales: [],
    weeklySales: [],
    quarterlySales: [],
    totalOrders: [],
    customerActivity: []
  });
  const [weeks, setWeeks] = useState<number[]>([]);
  const [years, setYears] = useState<number[]>([]);
  const productWiseChartRef = useRef<HTMLDivElement>(null);
  const statewiseChartRef = useRef<HTMLDivElement>(null);
  const salesReportRef = useRef<HTMLDivElement>(null);
  const revenueReportRef = useRef<HTMLDivElement>(null);
  const totalOrderStatusReportRef = useRef<HTMLDivElement>(null);
  const customerActivityChartRef = useRef<HTMLDivElement>(null);

  //Product Wise Sale
  const [productSalesDateRange, setProductSalesDateRange] = useState<[Date, Date]>([dayjs().subtract(1, 'month').toDate(), new Date()]);
  const [productWiseChart, setProductWiseChart] = useState<any>();

  //State Wise Sales
  const [stateSalesDateRange, setStateSalesDateRange] = useState<[Date, Date]>([dayjs().subtract(1, 'month').toDate(), new Date()]);
  const [stateWiseChart, setStateWiseChart] = useState<any>();

  // Quarterly Revenue Report
  const [quarterSelectedYear, setQuarterSelectedYear] = useState<number>(new Date().getFullYear());
  const [revenueReportChart, setRevenueReportChart] = useState<any>();

  //Weekly Sales Report
  const [weekSelectedYear, setWeekSelectedYear] = useState(new Date().getFullYear());
  const [weekSelectedWeek, setWeekSelectedWeek] = useState(1);
  const [salesReportChart, setSalesReportChart] = useState<any>();

  //Total Order Status Report
  const [orderReportDateRange, setOrderReportDateRange] = useState<[Date, Date]>([dayjs().subtract(1, 'month').toDate(), new Date()]);
  const [totalOrderStatusReportChart, setTotalOrderStatusReportChart] = useState<any>();

  //Customer Activity Status
  const [customerSelectedYear, setCustomerSelectedYear] = useState(new Date().getFullYear());
  const [customerActivityChart, setCustomerActivityChart] = useState<any>();

  const [fullChartViewDisplay, setFullChartViewDisplay] = useState(false);
  const [selectedChartOption, setSelectedChartOption] = useState<any>(null);

  const getWeekNumber = (date: Date) => {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  };

  useEffect(() => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentWeek = getWeekNumber(currentDate);

    const yearsArray = Array.from({ length: currentYear - 2023 + 1 }, (_, i) => 2023 + i);
    setYears(yearsArray);

    const weeksArray = Array.from({ length: 52 }, (_, i) => i + 1);
    setWeeks(weeksArray);

    setWeekSelectedWeek(currentWeek);
    setWeekSelectedYear(currentYear);
    setQuarterSelectedYear(currentYear);
    setCustomerSelectedYear(currentYear);
  }, []);

  useEffect(() => {
    getGraphData();
  }, [])

  const getGraphData = async () => {
    try {
      const graphData = props?.graphData;

      graphData.forEach((dataEntry: any) => {
        const dashboardType = dataEntry.dashboardType;
        const data = dataEntry.data;

        switch (dashboardType) {
          case 'PRODUCTWISESALES':
            setChartsDashboardData((prevData) => ({ ...prevData, productSales: data }));
            if (data && data.length) {
              initProductWiseChart(data);
            }
            break;
          case 'STATEWISESALES':
            setChartsDashboardData((prevData) => ({ ...prevData, stateSales: data }));
            if (data && data.length) {
              initStatewiseChart(data);
            }
            break;
          case 'ORDERSTATUSREPORT':
            setChartsDashboardData((prevData) => ({ ...prevData, totalOrders: data }));
            if (data && data.length) {
              initTotalOrderStatusReport(data);
            }
            break;
          case 'QUATERLYSALESREPORT':
            setChartsDashboardData((prevData) => ({ ...prevData, quarterlySales: data }));
            if (data && data.length) {
              initQuaterlyRevenueReport(data);
            }
            break;
          case 'WEEKLYSALESREPORT':
            setChartsDashboardData((prevData) => ({ ...prevData, weeklySales: data }));
            if (data && data.length) {
              initWeeklySalesReport(data);
            }
            break;
          case 'CUSTOMERACTIVITYREPORT':
            setChartsDashboardData((prevData) => ({ ...prevData, customerActivity: data }));
            if (data && data.length) {
              initCustomerActivityChart(data);
            }
            break;
          default:
            console.warn('Unknown dashboard type:', dashboardType);
            break;
        }
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };


  const initProductWiseChart = (data: any) => {
    const chartDom = productWiseChartRef.current;
    if (chartDom) {
      const myChart = echarts.init(chartDom);

      if (!data || data.length === 0) {
        console.error("No data available for the chart.");
        return;
      }

      const groupedData = data.reduce((acc: any, cur: any) => {
        if (!acc[cur.category]) {
          acc[cur.category] = [];
        }
        acc[cur.category].push(cur);
        return acc;
      }, {});

      const categories = Object.keys(groupedData);
      const series: any = [];

      const colors = ["#ff7f50", "#87cefa", "#da70d6"];

      categories.forEach((category) => {
        groupedData[category].slice(0, 3).forEach((product: any, index: any) => {
          if (!series[index]) {
            series[index] = {
              name: `Product ${index + 1}`,
              type: "bar",
              stack: "total",
              data: [],
              itemStyle: {
                color: colors[index % colors.length],
              },
            };
          }
          series[index].data.push({
            value: product.totalQuantity,
            productName: product.productName,
            totalSales: product.totalSales,
          });
        });
      });

      const option = {
        title: {
          textStyle: {
            fontFamily: "Poppins",
            fontWeight: "600",
            color: "#212529",
          },
        },
        tooltip: {
          trigger: "axis",
          confine: true,
          axisPointer: {
            type: "shadow",
          },
          formatter: (params: any) => {
            let tooltipContent = `${params[0].name}<br/>`;
            params.forEach((param: any) => {
              const productData = param.data;
              const color = param.color;
              tooltipContent += `<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${color};"></span>
                                 <strong>${productData.productName}</strong><br/>
                                 Quantity: ${productData.value}<br/>
                                 Sales: ${productData.totalSales}<br/>`;
            });
            return tooltipContent;
          },
        },
        xAxis: {
          type: "category",
          data: categories,
          axisLabel: {
            rotate: 20,
          },
        },
        yAxis: {
          type: "value",
        },
        series: series,
      };

      myChart.setOption(option);
      setProductWiseChart(option);
    };
  }

  const initStatewiseChart = async (data: any) => {
    const chartDom = statewiseChartRef.current;
    if (chartDom) {
      const myChart = echarts.init(chartDom);

      const tmp_XAxis = data.map((data: any) => data.states);
      const tmp_YAxis = data.map((data: any) => {
        return (typeof data.totalSales === 'number' ? data.totalSales.toFixed(0) : '0');
      });

      const option = {
        tooltip: {
          confine: true,
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          data: ['Sales']
        },
        toolbox: {
          show: false
        },
        xAxis: {
          type: 'category',
          data: tmp_XAxis,
          axisLabel: {
            rotate: 20,
          },
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: 'Sales',
            type: 'bar',
            data: tmp_YAxis,
            itemStyle: {
              color: (params: any) => {
                const colors = ['#ff7f50', '#87cefa', '#da70d6', '#32cd32', '#ff69b4', '#ba55d3', '#cd5c5c', '#ffa07a'];
                return colors[params.dataIndex % colors.length];
              }
            },
            barWidth: '10px',
            markPoint: {
              data: [
                { type: 'max', name: 'Max' },
                { type: 'min', name: 'Min' }
              ]
            },
            markLine: {
              data: [{ type: 'average', name: 'Avg' }]
            }
          }
        ]
      };

      myChart.setOption(option);
      setStateWiseChart(option);

      return () => {
        myChart.dispose();
      };
    }
  };

  const initWeeklySalesReport = (data: any) => {
    const chartDom = salesReportRef.current;
    if (chartDom) {
      const myChart = echarts.init(chartDom);

      const tmp_XAxis = data.map((d: any) => d.dayOfWeek);
      const tmp_YAxis = data.map((d: any) => d.totalSales);

      const option = {
        title: {
          text: 'Weekly Sales Report',
          textStyle: {
            fontFamily: 'Poppins',
            fontWeight: '600',
            color: '#212529',
          },
        },
        tooltip: {
          trigger: 'axis',
          confine: true,
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: tmp_XAxis,
          axisLabel: {
            rotate: 20,
          },
        },
        yAxis: {
          type: 'value',
        },
        series: [
          {
            name: 'Sales',
            type: 'line',
            data: tmp_YAxis,
            areaStyle: {},
          },
        ],
      };

      myChart.setOption(option);
      setSalesReportChart(option);
    }
  };

  const initQuaterlyRevenueReport = (data: any) => {
    const chartDom = revenueReportRef.current;
    if (chartDom) {
      const myChart = echarts.init(chartDom);

      const tmp_XAxis = data.map((item: any) => item.quarter);
      const tmp_YAxis = data.map((item: any) => parseFloat(item.totalSales).toFixed(0));

      const option = {
        title: {
          textStyle: {
            fontFamily: 'Poppins',
            fontWeight: '600',
            color: '#212529',
          },
        },
        tooltip: {
          trigger: 'axis',
          confine: true,
        },
        xAxis: {
          type: 'category',
          data: tmp_XAxis,
          axisLabel: {
            rotate: 20,
          },
        },
        yAxis: {
          type: 'value',
        },
        series: [
          {
            name: 'Revenue',
            type: 'bar',
            barWidth: '10px',
            data: tmp_YAxis,
          },
        ],
      };

      myChart.setOption(option);
      setRevenueReportChart(option);
    }
  };

  const initTotalOrderStatusReport = (data: any) => {
    const chartDom = totalOrderStatusReportRef.current;
    if (chartDom) {
      const myChart = echarts.init(chartDom);
      const tmpOrdersStatusData = data.map((data: any) => ({
        value: data.totalOrders,
        name: data.orderStatus,
      }));

      const option = {
        // title: {
        //   text: 'Total Order Status Report',
        //   textStyle: {
        //     fontFamily: 'Poppins',
        //     fontWeight: '600',
        //     color: '#212529',
        //   },
        // },
        tooltip: {
          trigger: 'item',
          confine: true,
        },
        legend: {
          orient: 'vertical',
          left: 'left',
        },
        series: [
          {
            name: 'Orders',
            type: 'pie',
            radius: '50%',
            data: tmpOrdersStatusData,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)',
              },
            },
          },
        ],
      };
      myChart.setOption(option);
      setTotalOrderStatusReportChart(option);
    }
  }

  const initCustomerActivityChart = (data: any) => {
    const chartDom = customerActivityChartRef.current;
    if (chartDom) {
      const myChart = echarts.init(chartDom);

      const sortedData = data.sort((a: any, b: any) => a.monthNumber - b.monthNumber);

      const tmp_XAxis = sortedData.map((data: any) => data.monthName);
      const tmp_YAxis = sortedData.map((data: any) => data.userCount);

      const option = {
        tooltip: { confine: true },
        xAxis: {
          type: 'category',
          data: tmp_XAxis,
          axisLabel: { rotate: 20 },
        },
        yAxis: { type: 'value' },
        series: [
          {
            data: tmp_YAxis,
            type: 'bar',
            barWidth: '10px',
            itemStyle: {
              color: (params: any) => {
                const colors = ['#ff7f50', '#87cefa', '#da70d6', '#32cd32', '#ffa500', '#1e90ff', '#ff69b4', '#00ff7f', '#d2b48c', '#4682b4', '#d2691e', '#8a2be2'];
                return colors[params.dataIndex % colors.length];
              },
            },
          },
        ],
      };

      myChart.setOption(option);
      setCustomerActivityChart(option);
    }
  };

  const applyGraphFilter = async (Type: string) => {
    dashboardEntity.dashboardType = Type;
    dashboardEntity.fromDate = null;
    dashboardEntity.toDate = null;
    dashboardEntity.year = null;
    dashboardEntity.week = null;
    dashboardEntity.month = null;

    if (Type == "PRODUCTWISESALES") {
      if (productSalesDateRange.length == 2) {
        const [startDate, endDate] = productSalesDateRange;
        dashboardEntity.fromDate = new Date(new Date(startDate).setDate(startDate.getDate() + 1));
        dashboardEntity.toDate = new Date(new Date(endDate).setDate(endDate.getDate() + 1));
      }
    } else if (Type == "STATEWISESALES") {
      if (stateSalesDateRange.length == 2) {
        const [startDate, endDate] = stateSalesDateRange;
        dashboardEntity.fromDate = new Date(new Date(startDate).setDate(startDate.getDate() + 1));
        dashboardEntity.toDate = new Date(new Date(endDate).setDate(endDate.getDate() + 1));
      }
    } else if (Type == "ORDERSTATUSREPORT") {
      if (orderReportDateRange.length == 2) {
        const [startDate, endDate] = orderReportDateRange;
        dashboardEntity.fromDate = new Date(new Date(startDate).setDate(startDate.getDate() + 1));
        dashboardEntity.toDate = new Date(new Date(endDate).setDate(endDate.getDate() + 1));
      }
    } else if (Type == "QUATERLYSALESREPORT") {
      dashboardEntity.year = quarterSelectedYear;
    } else if (Type == "WEEKLYSALESREPORT") {
      dashboardEntity.week = weekSelectedWeek;
      dashboardEntity.year = weekSelectedYear;
    } else if (Type == "CUSTOMERACTIVITYREPORT") {
      dashboardEntity.year = customerSelectedYear;
    }

    setDashboardEntity(dashboardEntity);
    // await getDashboardDataDynamically(dashboardEntity);
  };

  const itemTemplate = (product: any, index: number) => {
    const rankBackgroundColor = (() => {
      switch (index) {
        case 0:
          return "bg-green-700 text-white";
        case 1:
          return "bg-yellow-500 text-white";
        case 2:
          return "bg-orange-500 text-white";
        case 3:
          return "bg-pink-600 text-white";
        case 4:
          return "bg-purple-500 text-white";
        default:
          return "bg-gray-200 text-gray-600";
      }
    })();

    return (
      <div
        key={product.rank}
        className="flex items-center gap-4 p-3 border-b last:border-none">
        <div className="border rounded-md p-1">
          {product.image && (
            <Image
              src={img.src}
              alt={product.productName}
              width={28}
              height={28}
              className="rounded-md object-cover"
            />
          )}
        </div>

        <div className="flex-1">
          <h6 className="text-sm font-bold">{product.productName}</h6>
          <span className="text-gray-500 font-bold text-xs">
            {product.salesCount} Sales
          </span>
        </div>

        <div
          className={`rounded-full w-8 h-8 flex items-center justify-center font-bold ${rankBackgroundColor}`}>
          {product.rank}
        </div>
      </div>
    );
  };

  const handleProductSalesDateRange = (newDateRange: [Date, Date]) => {
    setProductSalesDateRange(newDateRange);
  };

  const handleStateSalesDateRange = (newDateRange: [Date, Date]) => {
    setStateSalesDateRange(newDateRange);
  };

  const handleQuarterYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setQuarterSelectedYear(parseInt(e.target.value));
  };

  const handleOrderReportDateRange = (newDateRange: [Date, Date]) => {
    setOrderReportDateRange(newDateRange);
  };

  const handleCustomerYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setCustomerSelectedYear(parseInt(event.target.value, 10));
  };

  const viewFullCart = (chartId: string) => {
    setFullChartViewDisplay(true);

    switch (chartId) {
      case 'product-wise-chart':
        // setViewProductWiseChart(true);
        // setChartHeight(600);
        setSelectedChartOption(productWiseChart);
        break;
      case 'statewise-chart':
        setSelectedChartOption(stateWiseChart);
        break;
      case 'sales-report':
        setSelectedChartOption(salesReportChart);
        break;
      case 'revenue-report':
        setSelectedChartOption(revenueReportChart);
        break;
      case 'total-order-status-report':
        setSelectedChartOption(totalOrderStatusReportChart);
        break;
      case 'customer-activity-chart':
        setSelectedChartOption(customerActivityChart);
        break;
      default:
        setSelectedChartOption(null);
    }
  };

  return (
    <div className="flex flex-col relative h-screen overflow-y-auto">
      <h2 className="text-2xl font-bold mb-4">Dashboard</h2>

      <div className="grid grid-cols-1 lg:grid-cols-4 sm:grid-cols-2 md:grid-cols-2 gap-4">
        <Link href="/admin/buyorders" passHref>
          <div className="relative w-full mb-3 cursor-pointer">
            {/* statistics   */}
            <Card className="bg-white p-ripple hover:shadow-lg rounded-xl group transition-all duration-300 h-[110px] overflow-hidden">
              <div className="flex justify-between items-center p-4 h-full group-hover:bg-black">
                <div className="content">
                  <span className="text-sm  text-gray-500 font-bold group-hover:text-white transition-colors duration-300">
                    Overall Orders
                  </span>
                  <h3 className="text-2xl font-bold group-hover:text-white transition-colors duration-300">
                    {dashboardData.statusCount !== null ? `${dashboardData.statusCount} ` : "Loading..."}
                  </h3>
                </div>
                <div className="icon flex items-center justify-center w-12 h-12 bg-red-100 rounded-full transition-colors duration-300 group-hover:bg-black group-hover:text-white">
                  <FiShoppingBag className="text-red-600 text-2xl transition-colors duration-300 group-hover:text-white" />
                </div>
              </div>
              <Ripple />
            </Card>
          </div>
        </Link>

        <Link href="/admin/buyorders" passHref>
          <div className="relative w-full mb-3 cursor-pointer">
            <Card className="bg-white p-ripple hover:shadow-lg rounded-xl group transition-all duration-300 h-[110px] overflow-hidden">
              <div className="flex justify-between items-center p-4 h-full group-hover:bg-black">
                <div className="content">
                  <span className="text-sm  text-gray-500 font-bold group-hover:text-white transition-colors duration-300">
                    Order Process TimeOut
                  </span>
                  <h3 className="text-2xl font-bold group-hover:text-white transition-colors duration-300">
                    {dashboardData.orderTimeout !== null
                      ? `${dashboardData.orderTimeout} `
                      : "Loading..."}
                  </h3>
                </div>
                <div className="icon flex items-center justify-center w-12 h-12 bg-rose-100 rounded-full transition-colors duration-300 group-hover:bg-black group-hover:text-white">
                  <RiShoppingCartFill className="text-rose-400 text-2xl transition-colors duration-300 group-hover:text-white" />
                </div>
              </div>
              <Ripple />
            </Card>
          </div>
        </Link>

        <Link href="/admin/raisetickets" passHref>
          <div className="relative w-full mb-3 cursor-pointer">
            <Card className="bg-white p-ripple hover:shadow-lg rounded-xl group transition-all duration-300 h-[110px] overflow-hidden">
              <div className="flex justify-between items-center p-4 h-full group-hover:bg-black">
                <div className="content">
                  <span className="text-sm  text-gray-500 font-bold group-hover:text-white transition-colors duration-300">
                    New Tickets
                  </span>
                  <h3 className="text-2xl font-bold group-hover:text-white transition-colors duration-300">
                    {dashboardData.ticketsCount !== null
                      ? `${dashboardData.ticketsCount} `
                      : "Loading..."}
                  </h3>
                </div>
                <div className="icon flex items-center justify-center w-12 h-12 bg-violet-100 rounded-full transition-colors duration-300 group-hover:bg-black group-hover:text-white">
                  <BsTicketPerforated className="text-violet-600 text-2xl transition-colors duration-300 group-hover:text-white" />
                </div>
              </div>
              <Ripple />
            </Card>
          </div>
        </Link>

        <Link href="/admin/feedbacks" passHref>
          <div className="relative w-full mb-3 cursor-pointer">
            <Card className="bg-white p-ripple hover:shadow-lg rounded-xl group transition-all duration-300 h-[110px] overflow-hidden">
              <div className="flex justify-between items-center p-4 h-full group-hover:bg-black">
                <div className="content">
                  <span className="text-sm  text-gray-500 font-bold group-hover:text-white transition-colors duration-300">
                    Feedback
                  </span>
                  <h3 className="text-2xl font-bold group-hover:text-white transition-colors duration-300">
                    {dashboardData.feedbackCount !== null
                      ? `${dashboardData.feedbackCount} `
                      : "Loading..."}
                  </h3>
                </div>
                <div className="icon flex items-center justify-center w-12 h-12 bg-violet-100 rounded-full transition-colors duration-300 group-hover:bg-black group-hover:text-white">
                  <MdOutlineFeedback className="text-violet-400 text-2xl transition-colors duration-300 group-hover:text-white" />
                </div>
              </div>
              <Ripple />
            </Card>
          </div>
        </Link>

        <Link href="/admin/discusses" passHref>
          <div className="relative w-full mb-3 cursor-pointer">
            <Card className="bg-white p-ripple hover:shadow-lg rounded-xl group transition-all duration-300 h-[110px] overflow-hidden">
              <div className="flex justify-between items-center p-4 h-full group-hover:bg-black">
                <div className="content">
                  <span className="text-sm  text-gray-500 font-bold group-hover:text-white transition-colors duration-300">
                    Post Approvals
                  </span>
                  <h3 className="text-2xl font-bold group-hover:text-white transition-colors duration-300">24</h3>
                </div>
                <div className="icon flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full transition-colors duration-300 group-hover:bg-black group-hover:text-white">
                  <RiImageFill className="text-blue-600 text-2xl transition-colors duration-300 group-hover:text-white" />
                </div>
              </div>
              <Ripple />
            </Card>
          </div>
        </Link>

        <Link href="/admin/coupon" passHref>
          <div className="relative w-full mb-3 cursor-pointer">
            <Card className="bg-white p-ripple hover:shadow-lg rounded-xl group transition-all duration-300 h-[110px] overflow-hidden">
              <div className="flex justify-between items-center p-4 h-full group-hover:bg-black">
                <div className="content">
                  <span className="text-sm  text-gray-500 font-bold group-hover:text-white transition-colors duration-300">
                    Coupons used
                  </span>
                  <h3 className="text-2xl font-bold group-hover:text-white transition-colors duration-300">
                    {dashboardData.usedCouponCount !== null && dashboardData.totalCouponCount !== null
                      ? `${dashboardData.usedCouponCount} /${dashboardData.totalCouponCount}`
                      : "Loading..."}
                  </h3>
                </div>
                <div className="icon flex items-center justify-center w-12 h-12 bg-sky-100 rounded-full transition-colors duration-300 group-hover:bg-black group-hover:text-white">
                  <RiCoupon4Fill className="text-sky-500 text-2xl transition-colors duration-300 group-hover:text-white" />
                </div>
              </div>
              <Ripple />
            </Card>
          </div>
        </Link>

        <Link href="/admin/myplot" passHref>
          <div className="relative w-full mb-3 cursor-pointer">
            <Card className="bg-white p-ripple hover:shadow-lg rounded-xl group transition-all duration-300 h-[110px] overflow-hidden">
              <div className="flex justify-between items-center p-4 h-full group-hover:bg-black">
                <div className="content">
                  <span className="text-sm  text-gray-500 font-bold group-hover:text-white transition-colors duration-300">
                    Irrigation Plan Request
                  </span>
                  <h3 className="text-2xl font-bold group-hover:text-white transition-colors duration-300">
                    {dashboardData.planAmount !== null
                      ? `${dashboardData.planAmount} `
                      : "Loading..."}
                  </h3>
                </div>
                <div className="icon flex items-center justify-center w-12 h-12 bg-green-100 rounded-full transition-colors duration-300 group-hover:bg-black group-hover:text-white">
                  <RiMoneyRupeeCircleFill className="text-green-400 text-2xl transition-colors duration-300 group-hover:text-white" />
                </div>
              </div>
              <Ripple />
            </Card>
          </div>
        </Link>

        <Link href="admin/dealer/appusers/dealerApprove" passHref>
          <div className="relative w-full mb-3 cursor-pointer">
            <Card className="bg-white p-ripple hover:shadow-lg rounded-xl group transition-all duration-300 h-[110px] overflow-hidden">
              <div className="flex justify-between items-center p-4 h-full group-hover:bg-black">
                <div className="content">
                  <span className="text-sm  text-gray-500 font-bold group-hover:text-white transition-colors duration-300">
                    Dealer Request
                  </span>
                  <h3 className="text-2xl font-bold group-hover:text-white transition-colors duration-300">
                    {dashboardData.dealerCount !== null
                      ? `${dashboardData.dealerCount} `
                      : "Loading..."}
                  </h3>
                </div>
                <div className="icon flex items-center justify-center w-12 h-12 bg-lime-100 rounded-full transition-colors duration-300 group-hover:bg-black group-hover:text-white">
                  <RiUser2Fill className="text-lime-500 text-2xl transition-colors duration-300 group-hover:text-white" />
                </div>
              </div>
              <Ripple />
            </Card>
          </div>
        </Link>
      </div>

      {/* orderReport */}
      <div className="orderReport">
        <div className="grid lg:grid-cols-12 md:grid-cols-12 sm:grid-cols-1 gap-8 mt-8">
          <div className="lg:col-span-3 md:col-span-12 sm:col-span-12  rounded-lg bg-white shadow-md overflow-hidden">
            <div className="p-4  bg-white border-b border-dashed">
              <h4 className="text-lg font-bold">Trending Products</h4>
              <small className=" text-gray-500 text-sm font-semibold">Trending Product activity over time.</small>
            </div>

            <div className="">
              {dashboardData.products.length > 0 ? (
                <div>
                  {dashboardData.products.map(itemTemplate)}
                </div>
              ) : (
                <div className="p-4">Loading trending products...</div>
              )}
            </div>
          </div>

          <div className="lg:col-span-9 md:col-span-12 sm:col-span-12 rounded-xl bg-white shadow-md mr-2">
            <div className="p-4 bg-white border-b border-dashed">
              <h4 className="text-lg font-bold ">Recent Orders</h4>
              <div className="flex justify-between items-center">
                <small className="text-gray-500 text-sm font-semibold">
                  Total orders activity over time.
                </small>
                <Link href={`/admin/buyorders/`} className="flex items-center text-xs font-bold text-gray-500">
                  View All
                  <PiArrowUpRightFill className="h-3 w-3 ml-1" />
                </Link>
              </div>
            </div>
            <div className="p-4">
              <DataTable
                value={dashboardData.orders}
                stripedRows
                scrollable
                scrollHeight="400px"
                tableStyle={{ minWidth: "30rem" }}
              >
                <Column
                  field="orderId"
                  header="Order ID"
                  headerStyle={{ backgroundColor: "#333", color: "#fff", textAlign: "left", }}
                  bodyClassName="text-left truncate font-sm font-bold" />
                <Column
                  field="name"
                  header="Order By"
                  headerStyle={{ backgroundColor: "#333", color: "#fff", textAlign: "left", }}
                  bodyClassName="text-left truncate font-sm font-bold" />
                <Column
                  field="orderStatus"
                  header="Status"
                  headerStyle={{ backgroundColor: "#333", color: "#fff", textAlign: "left", }}
                  body={(rowData: any) =>
                    <div className="text-center truncate font-sm">
                      <div
                        title={rowData.orderStatus}
                        className="bg-yellow-400 text-white text-xs font-semibold capitalize px-2 py-2 rounded"
                      >
                        {rowData.orderStatus}
                      </div>
                    </div>
                  }
                  bodyClassName="text-left"
                />
                <Column
                  field="orderTotalAmt"
                  header="Price"
                  headerStyle={{ backgroundColor: "#333", color: "#fff", textAlign: "right", }}
                  body={(rowData: any) =>
                    <div className="text-center truncate text-sm font-bold">
                      <div title={rowData.orderTotalAmt} className="flex justify-start items-center">
                        <MdOutlineCurrencyRupee className=" h-3 w-3" />
                        {rowData.orderTotalAmt}
                      </div>
                    </div>
                  }
                />
                <Column
                  field="orderdate"
                  header="Order Date"
                  headerStyle={{ backgroundColor: "#333", color: "#fff", textAlign: "center", }}
                  body={(rowData: any) =>
                    new Date(rowData.orderdate).toLocaleDateString()
                  }
                  bodyClassName="text-left font-bold"
                />
                <Column
                  header="Action"
                  headerStyle={{ backgroundColor: "#333", color: "#fff", textAlign: "center", }}
                  body={(rowData: any) => (
                    <Link className="font-bold" href={`/admin/buyorders/view/${rowData.id}`}>
                      <IoEyeOutline className=" h-5 w-5" />
                    </Link>
                  )}
                  bodyClassName="text-left"
                />
              </DataTable>
            </div>
          </div>
        </div>
      </div>

      {/* chart */}
      <div className="chart mt-10">
        <h2 className="text-3xl font-bold mb-4">Reports</h2>

        <div className="grid lg:grid-cols-2 sm:grid-cols-1 md:grid-cols-1 gap-8">
          <div className="bg-white shadow-md rounded p-4">
            <div className="flex justify-between items-center mb-2">
              <h6 className="text-lg font-semibold">Product Wise Sale</h6>
              <div className="" onClick={() => viewFullCart('product-wise-chart')}>
                <MdFullscreen className=" h-6 w-6 cursor-pointer" />
              </div>
            </div>

            <div className="flex items-center mb-4">
              <Input
                type="date"
                value={dayjs(productSalesDateRange[0]).format('YYYY-MM-DD')}
                onChange={(e) => handleProductSalesDateRange([new Date(e.target.value), productSalesDateRange[1]])}
                className="mr-2"
              />
              <Input
                type="date"
                value={dayjs(productSalesDateRange[1]).format('YYYY-MM-DD')}
                onChange={(e) => handleProductSalesDateRange([productSalesDateRange[0], new Date(e.target.value)])}
                className="mr-2"
              />
              <Button
                onClick={() => applyGraphFilter("PRODUCTWISESALES")}
                className="ml-2 bg-green-700 text-white px-4 py-2 rounded"
              >
                Apply
              </Button>
            </div>

            {chartsDashboardData.productSales ? (
              <div ref={productWiseChartRef} id="product-wise-chart" className="h-64"></div>
            ) : (
              <div className="text-center text-red-500">No Record Found</div>
            )}
          </div>

          <div className="bg-white shadow-md rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <h6 className="text-xl font-semibold">State Wise Sales</h6>
              <div className="" onClick={() => viewFullCart('statewise-chart')}>
                <MdFullscreen className=" h-6 w-6 cursor-pointer" />
              </div>
            </div>

            <div className="flex items-center mb-4">
              <Input
                type="date"
                className="mr-2"
                value={dayjs(stateSalesDateRange[0]).format('YYYY-MM-DD')}
                onChange={(e) => handleStateSalesDateRange([new Date(e.target.value), stateSalesDateRange[1]])}
              />
              <Input
                type="date"
                className="mr-2"
                value={dayjs(stateSalesDateRange[1]).format('YYYY-MM-DD')}
                onChange={(e) => handleStateSalesDateRange([new Date(e.target.value), stateSalesDateRange[1]])}
              />
              <Button
                className="bg-green-700 text-white px-4 py-2 rounded-md"
                onClick={() => applyGraphFilter('STATEWISESALES')}
              >
                Apply
              </Button>
            </div>
            {chartsDashboardData.stateSales ? (
              <div ref={statewiseChartRef} id="statewise-chart" className="h-64"></div>
            ) : (
              <div className="text-center text-red-500">No Record Found</div>
            )}

            {/* {!chartsDashboardData.stateSales && ()} */}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 sm:grid-cols-1 md:grid-cols-1 gap-8 mt-10">
          <div className="bg-white p-4 shadow-lg rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <h6 className="text-lg font-semibold">Weekly Sales Report</h6>
              <div className="" onClick={() => viewFullCart('sales-report')}>
                <MdFullscreen className=" h-6 w-6 cursor-pointer" />
              </div>
            </div>

            <div className="flex items-center mb-4">
              <div className="flex items-center gap-2">
                <Label htmlFor="weekSelect" className="text-sm">
                  Select Week:
                </Label>
                <select
                  id="weekSelect"
                  className="border p-2 rounded-md"
                  value={weekSelectedWeek}
                  onChange={(e) => setWeekSelectedWeek(Number(e.target.value))}
                >
                  {weeks.map((week, index) => (
                    <option key={index} value={week}>
                      Week {week}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2 ml-4">
                <Label htmlFor="yearSelect" className="text-sm">
                  Select Year:
                </Label>
                <select
                  id="yearSelect"
                  className="border p-2 rounded-md"
                  value={weekSelectedYear}
                  onChange={(e) => setWeekSelectedYear(Number(e.target.value))}
                >
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
              <Button
                onClick={() => applyGraphFilter('WEEKLYSALESREPORT')}
                className="ml-2 bg-green-700 text-white px-4 py-2 rounded"
              >
                Apply
              </Button>
            </div>
            {chartsDashboardData.weeklySales ? (
              <div ref={salesReportRef} id="sales-report" className="h-64"></div>
            ) : (
              <div className="text-center text-red-500">No Record Found</div>
            )}
          </div>

          <div className="bg-white shadow-md rounded p-4">
            <div className="flex justify-between items-center mb-2">
              <h6 className="text-lg font-semibold">Quarterly Revenue Report</h6>
              <div className="" onClick={() => viewFullCart('revenue-report')}>
                <MdFullscreen className=" h-6 w-6 cursor-pointer" />
              </div>
            </div>

            <div className="flex items-center mb-4">
              <label htmlFor="quarter_yearSelect" className="font-medium mr-2">
                Select Year:
              </label>
              <select
                id="quarter_yearSelect"
                className="border p-2 rounded-md"
                value={quarterSelectedYear}
                onChange={handleQuarterYearChange}
              >
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
              <button
                onClick={() => applyGraphFilter('QUATERLYSALESREPORT')}
                className="ml-2 bg-green-700 text-white px-4 py-2 rounded"
              >
                Apply
              </button>
            </div>
            {chartsDashboardData.quarterlySales ? (
              <div ref={revenueReportRef} id="revenue-report" className="h-64 mt-4"></div>
            ) : (
              <div className="text-center text-red-500">No Record Found</div>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 sm:grid-cols-1 md:grid-cols-1 gap-8 mt-10 mb-10">
          <div className="bg-white shadow-md rounded p-4">
            <div className="flex justify-between items-center mb-2">
              <h6 className="text-lg font-semibold">Total Order Status Report</h6>
              <div className="" onClick={() => viewFullCart('total-order-status-report')}>
                <MdFullscreen className=" h-6 w-6 cursor-pointer" />
              </div>
            </div>

            <div className="flex items-center mb-4">
              <Input
                type="date"
                value={dayjs(orderReportDateRange[0]).format('YYYY-MM-DD')}
                onChange={(e) => handleOrderReportDateRange([new Date(e.target.value), orderReportDateRange[1]])}
                className="mr-2"
              />
              <Input
                type="date"
                value={dayjs(orderReportDateRange[1]).format('YYYY-MM-DD')}
                onChange={(e) => handleOrderReportDateRange([orderReportDateRange[0], new Date(e.target.value)])}
                className="mr-2"
              />
              <Button
                onClick={() => applyGraphFilter("ORDERSTATUSREPORT")}
                className="ml-2 bg-green-700 text-white px-4 py-2 rounded"
              >
                Apply
              </Button>
            </div>
            {chartsDashboardData.totalOrders ? (
              <div ref={totalOrderStatusReportRef} id="total-order-status-report" className="h-64"></div>
            ) : (
              <div className="text-center text-red-500">No Record Found</div>
            )}
          </div>

          <div className="bg-white shadow-md rounded p-4">
            <div className="flex justify-between items-center mb-2">
              <h6 className="text-lg font-semibold">Customer Activity Status</h6>
              <div className="" onClick={() => viewFullCart('customer-activity-chart')}>
                <MdFullscreen className=" h-6 w-6 cursor-pointer" />
              </div>
            </div>

            <div className="flex items-center mb-4">
              <label htmlFor="quarter_yearSelect" className="font-medium mr-2">
                Select Year:
              </label>
              <select
                id="quarter_yearSelect"
                className="border p-2 rounded-md"
                value={customerSelectedYear}
                onChange={handleCustomerYearChange}
              >
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
              <Button
                onClick={() => applyGraphFilter("CUSTOMERACTIVITYREPORT")}
                className="ml-2 bg-green-700 text-white px-4 py-2 rounded"
              >
                Apply
              </Button>
            </div>
            {chartsDashboardData.customerActivity ? (
              <div ref={customerActivityChartRef} id="customer-activity-chart" className="h-64"></div>
            ) : (
              <div className="text-center text-red-500">No Record Found</div>
            )}
          </div>
        </div>
      </div>


      {fullChartViewDisplay && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50 p-10">
          <div className="relative w-full h-full p-4">
            <Button
              className="absolute top-4 right-4 text-white text-2xl"
              onClick={() => setFullChartViewDisplay(false)}
              title="Exit Fullscreen"
            >
              <AiOutlineCloseCircle className=" h-8 w-8" fill="black" />
            </Button>

            <div className="bg-white p-10 rounded shadow-lg w-full h-full">
              <ChartView option={selectedChartOption} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}