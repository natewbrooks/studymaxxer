'use client';

import FileDisplay from '@/components/file-display';
import FileUpload from '@/components/file-upload';
import SessionNav from '@/components/session-nav';
import URLTranscriber from '@/components/url-transcriber';
import TextLogo from '@/components/text-logo';
import React, { useState } from 'react';
import axios from 'axios';

/** Our Video type */
export interface VideoItem {
	url: string;
	prettyName: string;
	fileName?: string;
}

function appendToFileList(existing: FileList | null, newFile: File): FileList {
	const dataTransfer = new DataTransfer();

	if (existing) {
		Array.from(existing).forEach((file) => dataTransfer.items.add(file));
	}
	dataTransfer.items.add(newFile);

	return dataTransfer.files;
}

export default function Home() {
	// State for uploaded files
	const [files, setFiles] = useState<FileList | null>(null);
	const [videos, setVideos] = useState<VideoItem[]>([]);
	const [sessionName, setSessionName] = useState('');
	const BASE_URL = 'http://127.0.0.1:3000';

	const handleGenerate = async () => {
		if (!sessionName.trim()) {
			alert('Please enter a session name.');
			return;
		}

		// Prepar data to send to backend
		const fileData = files
			? Array.from(files).map((file) => ({
					name: file.name,
					path: file.webkitRelativePath || file.name, // Adjust as needed for uploaded files
			  }))
			: [];

		try {
			const response = await axios.post(`${BASE_URL}/api/generate_session`, {
				sessionName,
				files: fileData,
				videos,
			});

			alert('Session created successfully!');
			console.log('Session response:', response.data);
		} catch (error) {
			console.error('Error generating session:', error);
			alert('Failed to create session.');
		}
	};

	const addFile = (file: File) => {
		setFiles((prev) => appendToFileList(prev, file));
	};

	const removeFile = (fileName: string) => {
		if (!files) return;
		const dataTransfer = new DataTransfer();

		Array.from(files).forEach((f, index) => {
			if (f.name !== fileName) {
				dataTransfer.items.add(f);
			}
		});

		setFiles(dataTransfer.files);
		setVideos((prevVideos) => prevVideos.filter((video) => video.fileName !== fileName));
	};

	return (
		<main className='flex h-screen w-screen overflow-hidden'>
			<SessionNav />
			<div className='p-4 mb-4 lg:px-10 md:py-8 z-10 w-full max-w-5xl flex flex-col space-y-2 mx-auto h-full overflow-hidden'>
				<div className='block md:hidden'>
					<TextLogo />
				</div>

				<div className='flex flex-col md:flex-row w-full h-auto md:h-auto justify-between items-center space-y-1 md:space-y-0 md:space-x-1'>
					<FileUpload
						files={files}
						setFiles={setFiles}
					/>

					<URLTranscriber
						videos={videos}
						setVideos={setVideos}
						addFile={addFile}
						onRemoveFile={removeFile}
					/>
				</div>

				<span className='text-white text-sm text-end'>Files ({files?.length ?? 0})</span>

				<div className='flex flex-col w-full h-full overflow-y-auto rounded-md'>
					<div className='flex-1'>
						<FileDisplay
							files={files}
							onRemoveFile={removeFile}
						/>
					</div>
				</div>

				<input
					type='text'
					placeholder='Enter session name'
					value={sessionName}
					onChange={(e) => setSessionName(e.target.value)}
					className='p-2 border rounded w-full'
				/>
				<button
					onClick={handleGenerate}
					className='select-none cursor-pointer hover:bg-orange-100 w-full h-fit bg-gradient-to-bl from-orange-100 to-orange-200 whitespace-nowrap text-emerald-950 p-2 text-center font-bold rounded-md text-sm'>
					GENERATE
				</button>
			</div>
		</main>
	);
}
