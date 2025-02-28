import React, { useRef, useState } from 'react';

interface FileUploadProps {
	files: FileList | null;
	setFiles: React.Dispatch<React.SetStateAction<FileList | null>>;
}

export default function FileUpload({ files, setFiles }: FileUploadProps) {
	const [isDragging, setIsDragging] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const allowedExtensions = ['.txt', '.docx', '.pptx', '.png', '.jpg', '.pdf', '.xlsx'];

	const isAllowedFile = (file: File) => {
		const fileName = file.name.toLowerCase();
		return allowedExtensions.some((ext) => fileName.endsWith(ext));
	};

	const mergeFiles = (incomingFiles: FileList | Array<File>) => {
		const dataTransfer = new DataTransfer();

		// Add existing files (if any) to DataTransfer
		if (files) {
			Array.from(files).forEach((file) => dataTransfer.items.add(file));
		}

		// Keep track of file names we already have
		const existingNames = new Set(Array.from(dataTransfer.files).map((file) => file.name));

		let foundDuplicate = false;
		let foundInvalid = false;

		// Add new files, skipping duplicates and invalid types
		Array.from(incomingFiles).forEach((file) => {
			if (!isAllowedFile(file)) {
				foundInvalid = true;
			} else if (existingNames.has(file.name)) {
				foundDuplicate = true;
			} else {
				dataTransfer.items.add(file);
				existingNames.add(file.name);
			}
		});

		// Update state with the merged FileList
		setFiles(dataTransfer.files);

		// If we found duplicates or invalid files, alert the user
		if (foundDuplicate) {
			alert('Some duplicate files were ignored.');
		}
		if (foundInvalid) {
			alert('Some files were ignored due to invalid file types.');
		}
	};

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.files) {
			mergeFiles(event.target.files);
			handleUpload();
		}
	};

	const handleUpload = () => {
		if (files && files.length > 0) {
			Array.from(files).forEach((file, index) => {
				console.log(`File ${index + 1}:`, file.name);
			});
		} else {
			console.log('No files selected.');
		}
	};

	const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
		event.preventDefault();
		event.stopPropagation();
		setIsDragging(true);
	};

	const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
		event.preventDefault();
		event.stopPropagation();
		setIsDragging(false);
	};

	const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
		event.preventDefault();
		event.stopPropagation();
		setIsDragging(false);

		if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
			mergeFiles(event.dataTransfer.files);
			event.dataTransfer.clearData();
		}
	};

	const handleClick = () => {
		if (fileInputRef.current) {
			fileInputRef.current.click();
		}
	};

	return (
		<div className='flex flex-col pt-2 px-3 w-full h-full space-y-2 rounded-md bg-black/10'>
			<h1 className='text-white text-lg'>Upload Files</h1>

			<div
				className={`cursor-pointer border-dashed border-2 w-full h-full p-2 rounded-md flex
                    justify-center items-center transition-colors 
                    ${isDragging ? 'border-blue-500' : 'border-white/10 bg-black/10'}`}
				onDragOver={handleDragOver}
				onDragLeave={handleDragLeave}
				onDrop={handleDrop}
				onClick={handleClick}>
				{isDragging ? (
					<p className='text-white/50 text-center'>Drop files here...</p>
				) : (
					<div className={`flex flex-col items-center`}>
						<p className='text-white/50 text-center'>Drag & drop files here or click to browse</p>
						<p className='text-white/20 text-center text-xs'>
							.pdf .txt .docx .pptx .xslx .png .jpg
						</p>
					</div>
				)}
			</div>

			<div className='flex space-x-2 items-center'>
				<input
					type='file'
					multiple
					onChange={handleFileChange}
					ref={fileInputRef}
					style={{ display: 'none' }}
				/>
			</div>
		</div>
	);
}
