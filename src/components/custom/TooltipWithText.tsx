import React from 'react';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from '@/components/ui/button';
import { RiInformation2Line } from 'react-icons/ri';

const TooltipWithText = ({ text }:any) => {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button className='p-0 m-0'>
                        <RiInformation2Line size={13} className='cursor-pointer text-red-600' />
                    </Button>
                </TooltipTrigger>
                <TooltipContent className='bg-gray-500 text-white font-bold p-3'>
                    <p>{text}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};

export default TooltipWithText;