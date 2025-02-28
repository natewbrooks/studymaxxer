import React from 'react';
import File from './file';

interface FileDisplayProps {
	files: FileList | null;
	onRemoveFile?: (fileName: string) => React.MouseEvent; // <--- callback for removing a file
}

export default function FileDisplay({ files, onRemoveFile }: FileDisplayProps) {
	return (
		<div className='flex flex-col w-full h-full bg-black/10 p-3 rounded-md text-sm'>
			<div
				className='w-full grid grid-flow-row-dense gap-4'
				style={{
					gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
					gridAutoRows: 'min-content',
				}}>
				{files ? (
					Array.from(files).map((file, index) => (
						<File
							key={index}
							file={file}
							handleRemove={onRemoveFile}
						/>
					))
				) : (
					<span className='text-white'>Files will load here..</span>
				)}
			</div>
		</div>
	);
}
