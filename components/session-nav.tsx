import React, { useEffect, useState } from 'react';
import TextLogo from './text-logo';

export default function SessionNav() {
	return (
		<div className='hidden md:flex h-full w-64 flex-col justify-between space-y-4 bg-emerald-950 p-4 shadow-md'>
			<TextLogo />
			<ul className={`flex flex-col space-y-1 h-full items-center `}>
				<li
					className={`w-full bg-white/10 px-4 py-2 hover:bg-white/20 cursor-pointer rounded-md text-orange-100`}>
					COSC 290 Final Exam
				</li>
				<li className={`w-full px-4 py-2 hover:bg-white/10 cursor-pointer rounded-md text-white`}>
					COSC 418 Final Exam
				</li>{' '}
			</ul>
			<div className={`flex w-full h-fit justify-end rounded-md bg-orange-200`}>
				<div className={`border-l-2 px-3 py-1  border-emerald-950 h-full`}>{`>`}</div>
			</div>
		</div>
	);
}
