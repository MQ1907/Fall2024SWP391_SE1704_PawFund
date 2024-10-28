"use client";
import React, { useEffect } from 'react';
import { useParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "../../../lib/hook";
import { fetchEventById } from "../../../lib/features/event/eventSlice";

const Page = () => {
    const params = useParams();
    const id = params.id as string;
    const dispatch = useAppDispatch();
    const { currentEvent, status, error } = useAppSelector((state) => state.events);

    useEffect(() => {
        if (id) {
            dispatch(fetchEventById(id));
        }
    }, [id, dispatch]);

    if (status === "loading") {
        return <div>Loading...</div>;
    }

    if (status === "failed") {
        return <div>Error: {error}</div>;
    }

    if (!currentEvent) {
        return <div>Event not found</div>;
    }

    return (
        <div className='mt-[148px]'>
            <div className="flex h-auto py-6 font-medium">
                <div className="w-[90%] flex justify-center">
                    <div className="h-auto bg-white w-[800px] px-5 py-5 ml-[200px]">
                        <div className='ml-[8px]'>
                            <div className="relative">
                                <img 
                                    src={currentEvent.image} 
                                    alt=""
                                    className="w-full h-[500px] object-cover rounded-lg"
                                />
                            </div>
                            <div className="mt-6">
                                <h1 className="text-[34px] font-medium mb-4">{currentEvent.title}</h1>
                                
                                <div className="flex gap-4 text-[#6F6F6F] font-medium mb-4">
                                    <p>
                                        Start: {new Date(currentEvent.start).toLocaleDateString('vi-VN')}
                                    </p>
                                    <p>
                                        End: {new Date(currentEvent.end).toLocaleDateString('vi-VN')}
                                    </p>
                                </div>
                                <div className='flex gap-4 text-[#6F6F6F] font-medium mb-4'>
                                <p>
                                        Location: {currentEvent.location}
                                </p>
                                </div>
                                <hr className="border-t border-[#6F6F6F] my-4" />
                                <div className='text-[#6F6F6F] font-medium leading-relaxed'>
                                    <p className="text-justify">{currentEvent.description}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Page;
