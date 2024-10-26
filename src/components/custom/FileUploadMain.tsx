import React, { useEffect, useState } from 'react';
import { Input } from '../ui/input';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primeflex/primeflex.css';
import Image from 'next/image';
import { RiDeleteBin6Fill } from 'react-icons/ri';
import { Button } from '../ui/button';
import { FiPlus } from "react-icons/fi";


interface CustomFile {
    fileName: string;
    filePath: string;
    type: string;
}

interface FileUploadProps {
    onFileUpload: (files: CustomFile[]) => void;
    uploadFunction: (formData: FormData, tokenData?: any) => Promise<any>;
    downloadFunction?: (file: CustomFile, tokenData?: any) => Promise<Blob>; // Made optional with ?
    multiple?: boolean;
    showImage?: boolean;
    accept?: string;
    tokenData?: string;
    existingFiles?: CustomFile[];
}

function FileUploadMain({
    onFileUpload,
    uploadFunction,
    downloadFunction,
    multiple = false,
    showImage = false,
    accept = '',
    tokenData,
    existingFiles = [],
}: FileUploadProps) {

    const [uploadedFiles, setUploadedFiles] = useState<CustomFile[]>(existingFiles);
    const [uploadError, setUploadError] = useState<string | null>(null);

    useEffect(() => {
        setUploadedFiles(existingFiles);
    }, [existingFiles]);

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files) return;

        const filesArray = Array.from(files);
        const newUploadedFiles: CustomFile[] = [];

        for (const file of filesArray) {
            const formData = new FormData();
            formData.append('file', file);

            try {
                const response = await uploadFunction(formData, tokenData);
                console.log("response", response);

                const validFilePath = `${process.env.NEXT_PUBLIC_API_URL}/ImportFiles/${response.filePath.replace(/\\/g, "/")}`;
                newUploadedFiles.push({ fileName: response.fileName, filePath: response.filePath, type: response.type });

            } catch (error) {
                console.error('Upload failed:', error);
                setUploadError('Upload failed. Please try again.');
            }
        }
        const allFiles = [...uploadedFiles, ...newUploadedFiles];
        setUploadedFiles(allFiles);

        onFileUpload(allFiles);
        event.target.value = '';
    };

    const deleteAttachment = (file: CustomFile) => {
        const newFiles = uploadedFiles.filter(f => f != file);
        setUploadedFiles(newFiles);
        onFileUpload(newFiles);
    };

    const downloadFile = async (file: CustomFile) => {
        if (!downloadFunction) {
            console.error('Download function is not defined');
            setUploadError('Download function is not available.');
            return;
        }

        try {
            const response = await downloadFunction(file, tokenData);

            const blob = new Blob([response]);
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = file.fileName;
            link.click();
            URL.revokeObjectURL(link.href);
        } catch (error) {
            console.error('Download failed:', error);
            setUploadError('Download failed. Please try again.');
        }
    };

    return (
        <div className="file-attachments">
            <ul className="">
                {uploadedFiles.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {
                            uploadedFiles.map((file) => (
                                <li key={file.filePath} className=" relative flex flex-col items-center">
                                    <div className="relative flex items-center justify-center rounded border-2 border-green-600 p-2 m-1" style={{ width: '60px', height: '60px' }}>
                                        <div className="w-full h-full overflow-hidden rounded">
                                            <Image
                                                src={file.type.includes('pdf') ? '/assets/images/pdf-icon.png' : `${process.env.NEXT_PUBLIC_API_URL}/ImportFiles/${file.filePath.replace(/\\/g, "/")}`}
                                                // width={35}
                                                // height={35}
                                                layout="fill"
                                                objectFit="cover"
                                                onClick={() => downloadFile(file)}
                                                className="cursor-pointer"
                                                // className="rounded-full object-cover cursor-pointer"
                                                alt={file.fileName}
                                            />
                                        </div>
                                        <Button
                                            onClick={() => deleteAttachment(file)}
                                            className="absolute top-8 left-14 text-red-600" 
                                        >
                                            <RiDeleteBin6Fill className=' h-4 w-4' />
                                        </Button>
                                    </div>
                                </li>
                            ))}
                    </div>
                )}
            </ul>

            <label className="p-3 flex justify-center items-center text-center border border-green-700 rounded cursor-pointer bg-gray-100">
                <span>
                    <FiPlus className=' h-6 w-6 text-green-700' />
                </span>
                <Input
                    type="file"
                    accept={accept}
                    onChange={handleFileUpload}
                    className="hidden"  // Hides the input for custom styling
                    multiple={multiple}
                />
            </label>

        </div>
    );
};

export default FileUploadMain;
