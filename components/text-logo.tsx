import React from 'react';
export default function TextLogo() {
	return (
		<div className='flex h-fit w-fit flex-col -space-y-1 drop-shadow-md'>
			<h1 className='text-start text-3xl header drop-shadow-lg text-orange-100'>CRAM</h1>
			<h1 className='block header drop-shadow-lg text-orange-200 text-5xl'>MAXXER</h1>
			<h1 className='hidden md:block header drop-shadow-lg text-orange-100 text-3xl text-right leading-none'>
				3000
			</h1>
		</div>
	);
}
