import axios from 'axios';
import React, { useState } from 'react';
import { VideoItem } from '@/app/page';

interface URLTranscriberProps {
	addFile: (file: File) => void;
	videos: VideoItem[];
	setVideos: React.Dispatch<React.SetStateAction<VideoItem[]>>;
	onRemoveFile: (fileName: string) => void;
}

export default function URLTranscriber({
	addFile,
	videos,
	setVideos,
	onRemoveFile,
}: URLTranscriberProps) {
	const [inputValue, setInputValue] = useState<string>('');
	const BASE_URL = 'http://127.0.0.1:3000';

	const handleAddURL = async () => {
		try {
			const newURL = new URL(inputValue);

			// Check if the newURL already exists
			if (videos.some((video) => video.url === newURL.toString())) {
				alert('This URL is already added!');
				return;
			}

			// Add a new video to the parent's state
			setVideos((prev) => [
				...prev,
				{
					url: newURL.toString(),
					prettyName: '',
				},
			]);

			// Call backend to generate transcript
			const response = await axios.post(`${BASE_URL}/api/transcript`, {
				videoURL: newURL.toString(),
			});

			if (response.data.file_path && response.data.pretty_name) {
				const { file_path, pretty_name } = response.data;
				const fileName = file_path.split('/').pop() || 'transcript.txt';
				const videoTag = fileName.split('_')[0];

				// Fetch the transcript content
				const fileContent = await axios.get(`${BASE_URL}/api/transcript?videotag=${videoTag}`, {
					responseType: 'json',
				});

				// Create a new File from that content
				const prettyFileName = `${pretty_name} [TRANSCRIPT].txt`;
				const file = new File([fileContent.data.content], prettyFileName, {
					type: 'text/plain',
				});

				// Add the new file
				addFile(file);

				// Update the last added video with the pretty name
				setVideos((prevVideos) => {
					const updated = [...prevVideos];
					updated[updated.length - 1].prettyName = pretty_name;
					updated[updated.length - 1].fileName = prettyFileName;
					return updated;
				});
			}
		} catch (error) {
			alert('Invalid URL!');
		} finally {
			setInputValue('');
		}
	};

	return (
		<div className='flex flex-col w-full px-3 pt-2 h-full max-h-42 space-y-2 rounded-md bg-black/10'>
			<h1 className='text-white text-lg'>YouTube Video Transcriber</h1>

			{/* Input + ADD Button */}
			<div className='flex space-x-2'>
				<input
					type='text'
					value={inputValue}
					onChange={(e) => setInputValue(e.target.value)}
					onKeyDown={(e) => {
						if (e.key === 'Enter') {
							handleAddURL();
						}
					}}
					placeholder='Enter a YouTube URL...'
					className='p-2 rounded-md w-full border-2 border-dashed border-white/10 outline-none bg-black/10
                     placeholder:text-white/50 text-white'
				/>
				<button
					onClick={handleAddURL}
					className='px-2 bg-gradient-to-bl from-orange-100 to-orange-200 whitespace-nowrap text-emerald-950 text-sm font-bold
                     rounded-md hover:bg-opacity-50'>
					ADD
				</button>
			</div>

			{/* Video List */}
			<div className='w-full h-auto md:max-h-32 overflow-y-auto'>
				{videos.length > 0 && (
					<ul className='bg-black/10 flex flex-col space-y-2 w-full p-2 rounded-md'>
						{videos.map((video, index) => (
							<li
								key={index}
								className={`${
									index % 2 === 0 ? 'bg-white/10' : ''
								} rounded-md p-2 grid grid-cols-[auto_1fr_auto] items-stretch gap-4 text-white`}>
								<div
									className={`flex items-center justify-center font-bold px-2 py-2 rounded-md ${
										index % 2 === 0 ? 'text-black/50' : 'text-white/30'
									}`}>
									{index + 1}
								</div>

								<div className='w-full flex flex-col break-words'>
									<span
										className='text-[10px] text-white/50 break-all whitespace-normal'
										title={video.url}>
										{video.url}
									</span>
									<a
										className='text-md text-blue-300 hover:underline'
										href={video.url}
										target='_blank'
										rel='noopener noreferrer'>
										{video.prettyName || 'Loading...'}
									</a>
								</div>

								<button
									onClick={() => {
										if (video.fileName) {
											onRemoveFile(video.fileName);
										}
									}}
									className='hidden md:flex items-center justify-center
                             border-l-2 border-white/10 px-4 text-sm text-red-300 hover:underline'>
									X
								</button>
							</li>
						))}
					</ul>
				)}
			</div>
		</div>
	);
}
