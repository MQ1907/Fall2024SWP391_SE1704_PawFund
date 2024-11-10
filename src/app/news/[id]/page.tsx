"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { message } from "antd";
import { useAppDispatch, useAppSelector } from "../../../lib/hook";
import { fetchEventById, joinEvent } from "../../../lib/features/event/eventSlice";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

interface DecodedToken {
    id: string;
    exp: number;
    iat: number;
}

const Page = () => {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;
    const dispatch = useAppDispatch();
    const { currentEvent, status, error } = useAppSelector((state) => state.events);
    const [hasHydrated, setHasHydrated] = useState(false);
    const [token, setToken] = useState<string | null>(null);
    const [role, setRole] = useState<string | null>(null);
    const [isJoining, setIsJoining] = useState(false);
    const [hasJoined, setHasJoined] = useState(false);

    useEffect(() => {
        if (id) {
            dispatch(fetchEventById(id));
        }
    }, [id, dispatch]);

    useEffect(() => {
        setHasHydrated(true);
        if (typeof window !== "undefined") {
            const storedToken = localStorage.getItem("token");
            setToken(storedToken);

            if (storedToken) {
                try {
                    const decodedToken = jwtDecode<DecodedToken>(storedToken);
                    const userId = decodedToken.id;

                    const fetchUserRole = async () => {
                        try {
                            const response = await axios.get(`http://localhost:8000/users/${userId}`);
                            setRole(response.data.role);
                        } catch (error) {
                            console.error("Error fetching user role:", error);
                        }
                    };

                    fetchUserRole();

                    if (currentEvent && currentEvent.participants) {
                        setHasJoined(currentEvent.participants.includes(userId));
                    }

                } catch (error) {
                    console.error("Invalid token:", error);
                    localStorage.removeItem("token");
                    setToken(null);
                }
            }
        }
    }, [currentEvent]);

    const handleJoinEvent = async () => {
        if (!token) {
            router.push('/signin');
            return;
        }

        if (role === "ADMIN") {
            message.error('Admin accounts cannot join events.');
            return;
        }

        if (currentEvent.eventStatus !== "ON_GOING") {
            message.error('You can only join events that are currently ongoing');
            return;
        }

        if (hasJoined) {
            message.error('You have already joined this event');
            return;
        }

        try {
            setIsJoining(true);
            const decodedToken = jwtDecode<DecodedToken>(token);
            const userId = decodedToken.id;

            await dispatch(joinEvent({ 
                eventId: currentEvent._id, 
                userId: userId 
            })).unwrap();

            message.success('Joined event successfully!');
        } catch (error: any) {
            message.error(error.message || 'Failed to join event');
        } finally {
            setIsJoining(false);
        }
    };

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

                                <div className="mt-8 flex justify-end">
                                    <button 
                                        onClick={handleJoinEvent}
                                        disabled={isJoining || currentEvent.eventStatus !== "ON_GOING" || hasJoined}
                                        className={`w-[200px] ${
                                            isJoining || currentEvent.eventStatus !== "ON_GOING" || hasJoined
                                                ? 'bg-gray-400 cursor-not-allowed' 
                                                : 'bg-blue-500 hover:bg-blue-600'
                                        } text-white py-3 px-4 rounded-lg 
                                        transition duration-200 font-medium`}
                                    >
                                        {isJoining ? 'Joining...' : 
                                         hasJoined ? 'Already Joined' :
                                         currentEvent.eventStatus === "SCHEDULED" ? 'Event Not Started' :
                                         currentEvent.eventStatus === "COMPLETED" ? 'Event Ended' :
                                         'Join Event'}
                                    </button>
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
