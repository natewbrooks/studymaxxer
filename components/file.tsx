import React, { useEffect, useState } from 'react';

interface FileProps {
	file: File;
	handleRemove?: (fileName: string) => void;
}

const byteDisplay = (bytes: number): string => {
	if (bytes >= 1073741824) {
		return `${(bytes / 1073741824).toFixed(2)} GB`;
	} else if (bytes >= 1048576) {
		return `${(bytes / 1048576).toFixed(2)} MB`;
	} else if (bytes >= 1024) {
		return `${(bytes / 1024).toFixed(2)} KB`;
	} else {
		return `${bytes} bytes`;
	}
};

const getColorBySize = (bytes: number): string => {
	if (bytes < 1048576) {
		// Less than 1MB
		if (bytes < 10240) return 'bg-emerald-100';
		if (bytes < 102400) return 'bg-emerald-200';
		if (bytes < 512000) return 'bg-emerald-300';
		return 'bg-emerald-400';
	} else if (bytes < 10485760) {
		// Less than 10MB
		return 'bg-yellow-300';
	} else if (bytes < 52428800) {
		// Less than 50MB
		return 'bg-yellow-400';
	} else {
		// 50MB and above
		if (bytes < 104857600) return 'bg-orange-300';
		if (bytes < 524288000) return 'bg-orange-500';
		return 'bg-orange-600';
	}
};

export default function File({ file, handleRemove }: FileProps) {
	const [byteColor, setByteColor] = useState('');

	useEffect(() => {
		setByteColor(getColorBySize(file.size));
	}, [file.size]);

	return (
		<div
			className='relative group flex flex-col space-y-1 h-full w-full p-2 
                 rounded-md shadow-sm hover:scale-105 active:scale-100 
                 select-none outline-white border-4 border-transparent 
                 cursor-pointer bg-white text-black'>
			<button
				className='absolute -top-3 -right-3 hidden group-hover:block 
                   bg-white border-2 border-red-400 text-red-400 font-bold hover:bg-red-200 
                   rounded-full px-2 text-sm'
				onClick={() => {
					if (file && handleRemove) {
						handleRemove(file.name);
					}
				}}>
				X
			</button>

			<div className='flex w-full justify-between'>
				<span className={`whitespace-nowrap ${byteColor} w-fit px-2 rounded-full`}>
					{byteDisplay(file.size)}
				</span>
				<span className='break-words font-bold'>{file.name.split('.').pop()}</span>
			</div>

			<span className='break-words'>{file.name.split('.')[0]}</span>
		</div>
	);
}
