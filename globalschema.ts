import { z } from 'zod';

const imageSchema = z.object({
    fileName: z.string().nonempty("File name is required"),
    filePath: z.string().nonempty("File path is required"),
    type: z.string().nonempty("Type is required"),
});

const globalschema = z.object({
    name: z.string()
        .min(2, { message: "Name must be at least 2 characters long" })
        .regex(/^[\u0900-\u097F\u0000-\u007F0-9\s&'-]+$/, { message: "Name can only contain letters, numbers, spaces, apostrophes, and hyphens" })
        .optional(),


    uniqueName: z.string()
        .min(2, { message: "Name must be at least 2 character long" })
        .regex(/^[a-zA-Z\s'-]+$/, { message: "Name can only contain letters, spaces, apostrophes, and hyphens" })
        .optional(),
    url: z.string().min(2, { message: "Url should have minimum 2 characters!" }).optional(),
    appUserName: z.string().nonempty({ message: "App User Name is required!" }).optional(),
    shortDescription: z.string().min(1, { message: "Short Description should have minimum 2 characters!" }).optional(),
    description: z.string().nonempty({ message: "Description is required!" }).optional(),
    precaution: z.string().nonempty({ message: "precaution is required!" }).optional(),
    image: z.array(imageSchema).nonempty("Image cannot be empty").optional(),    

    // isActive: z.boolean().refine(val => val === true, {
    //     message: "Is Active must be checked.",
    // }).optional(),

    isActive: z.boolean().optional(),

    isSendNotification: z.boolean().refine(val => val === true, {
        message: "isSendNotification must be checked.",
    }).optional(),

    isApprove: z.boolean().refine(val => val === true, {
        message: "Is Approved must be checked.",
    }).optional(),

    uploadPhoto :  z.array(imageSchema).nonempty("Upload Photo cannot be empty").optional(),
    value: z.string().nonempty({ message: "Value is required!" }).optional(),
    section: z.string().nonempty({ message: "Section is required!" }).optional(),
    orderNo: z.string().nonempty({ message: "Order Number is required!" }).optional(),
    question: z.string().nonempty({ message: "Question is required!" }).optional(),

    appUserId: z.string().nonempty({ message: "App User ID is required!" }).optional(),
    amount: z.string().nonempty({ message: "Amount is required!" }).optional(),
    planAmount: z.string().nonempty({ message: "Plan Amount is required!" }).optional(),
    actualAmount: z.string().nonempty({ message: "Actual Amount is required!" }).optional(),
    totalPlot: z.string().nonempty({ message: "Total Allow Amount is required!" }).optional(),
    sku: z.string().nonempty({ message: "SKU is required!" }).optional(),
    productStatus: z.string().nonempty({ message: "Product Status is required!" }).optional(),
    minQty: z.string().nonempty({ message: "Minimum Quantity is required!" }).optional(),
    minQtyFarmer: z.string().nonempty({ message: " Minimum Qty Farmer is required!" }).optional(),
    isParent: z.boolean().refine(val => val === true, {
        message: "Is Parent must be checked.",
    }).optional(),
    startDate: z.string().refine((date) => !isNaN(Date.parse(date)), { message: "Invalid start date." }).optional(),
    endDate: z.string().refine((date) => !isNaN(Date.parse(date)), { message: "Invalid end date." }).optional(),
    regularPrice: z.string().nonempty({ message: "regularPrice is required!" }).optional(),
    salePrice: z.string().nonempty({ message: "salePrice is required!" }).optional(),
    salePriceFarmer: z.string().nonempty({ message: "salePriceFarmer is required!" }).optional(),
    upToDiscount: z.string().nonempty({ message: "upToDiscount is required!" }).optional(),
    validFrom: z.string().refine((date) => !isNaN(Date.parse(date)), { message: "Invalid start date." }).optional(),
    validTill: z.string().refine((date) => !isNaN(Date.parse(date)), { message: "Invalid end date." }).optional(),
    plotFaqQueAnsId: z.string().nonempty({ message: "plotFaqQueAnsId is required!" }).optional(),
    farmId: z.string().nonempty({ message: "farmId is required!" }).optional(),
    cropId: z.string().nonempty({ message: "cropId is required!" }).optional(),
    myPlotId: z.string().nonempty({ message: "myPlotId is required!" }).optional(),
    setDate: z.string().nonempty({ message: "setDate is required!" }).optional(),
    waterPoint: z.string().nonempty({ message: "waterPoint is required!" }).optional(),
    coordinate: z.string().nonempty({ message: "coordinate is required!" }).optional(),
    comment: z.string().nonempty({ message: "comment is required!" }).optional(),
    commentId: z.string().nonempty({ message: "commentId is required!" }).optional(),
    disscussId: z.string().nonempty({ message: "disscussId is required!" }).optional(),
    cropSeason: z.string().nonempty({ message: "Crop Season is required!" }).optional(),
    diseaseId: z.string().nonempty({ message: "Disease ID is required!" }).optional(),
    deficiencyDisorderId: z.string().nonempty({ message: "deficiencyDisorderId is required!" }).optional(),
    defaultImage: z
        .instanceof(File)
        .nullable()
        .refine(file => file === null || (file.size > 0), { message: "Product Image must not be empty" })
        .optional(),
    mobile: z.string().nonempty({ message: "Mobile is required!" }).optional(),   
    mobileVerified: z.boolean().optional(),
    role: z.string().nonempty({ message: "Role is required!" }).optional(),
    publish: z.string().nonempty({ message: "Publish is required!" }).optional(),    
    isAdmin: z.boolean().optional(),
    buyOrderId: z.string().nonempty({ message: "Buy Order ID is required!" }).optional(),

}).refine(data => {
    if (data.startDate && data.endDate) {
        return new Date(data.startDate) <= new Date(data.endDate);
    }
    if (data.validFrom && data.validTill) {
        return new Date(data.validFrom) <= new Date(data.validTill);
    }
    return true;
}, {
    message: "Start date must be before or equal to end date.",
    path: ["endDate", "validTill"],
});


export default globalschema;