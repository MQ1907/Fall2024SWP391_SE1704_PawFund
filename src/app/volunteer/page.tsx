"use client"
import Image from "next/image";
import React, { useState } from "react";

import { Button, Input, Modal, Select } from "antd";
import { CheckingType, HealthStatus } from "../../enum";
import { createHealthCheck } from "@/lib/features/pet/HealthCheckSlice";
import { useAppDispatch } from "@/lib/hook";

const Volunteer = () => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const showModal = () => {
    setOpen(true);
  };

  const handleOk = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOpen(false);
    }, 3000);
  };

  const handleCancel = () => {
    setOpen(false);
  };
 
    const [petId, setPetId] = useState('');
    const [healthStatus, setHealthStatus] = useState<HealthStatus | undefined>(undefined);
    const [healthStatusDescription, setHealthStatusDescription] = useState('');
    const [note, setNote] = useState('');
    const [weight, setWeight] = useState<number | undefined>(undefined);
    const [temperature, setTemperature] = useState<number | undefined>(undefined);
    const [checkingDate, setCheckingDate] = useState('');
    const [checkingBy, setCheckingBy] = useState('');
    const [checkingType, setCheckingType] = useState<CheckingType | undefined>(undefined);
  
    const handleSubmit = async () => {
      const healthCheckData = {
        petId,
        healthStatus,
        healthStatusDescription,
        note,
        weight,
        temperature,
        checkingDate,
        checkingBy,
        checkingType,
      };
  
      try {
        // Gọi action để tạo health check
        await dispatch(createHealthCheck(healthCheckData)).unwrap();
        handleOk(); // Đóng modal nếu thành công
      } catch (error) {
        console.error(error);
        // Bạn có thể hiển thị thông báo lỗi nếu cần
      }
    };
  return (
    <div className="pt-[148px]">
      <div
        className="w-full bg-cover bg-center relative"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.1)), url('/images/volunteer1.png')",
        }}
      >
        <div className="bg-black bg-opacity-30 w-full h-[210px] flex items-center justify-between px-8 py-16">
          <div>
            <h1 className="text-white text-[45px] font-bold ml-[170px]">
              VOLUNTEERS
            </h1>

            <div className="bg-[#D51C63] text-white text-[12px] py-1 px-[30px] rounded-md inline-flex items-center ml-[170px] w-[50%]">
              <a href="/" className="hover:text-blue-600">
                HomePage
              </a>
              <span className="mx-2">&gt;</span>
              <a href="/adopt">Adopt</a>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-[150px] pb-10">
        <div className="flex mt-10">
          <div className="w-[75%] h-[300px]">
            <div className="pl-10">
              <h1 className="text-[40px] ">
                Introducing dog and cat rescue volunteers
              </h1>
              <hr className="w-[15%] bg-gray-400 h-[2px]" />
              <div className="pt-7">
                PawFund Adoptions rescue operation can only be successful
                thanks to the combined efforts of the community and Volunteers.
                There are many ways for you to do your part to change the life
                of a dog or cat: become a Foster Caretaker, Volunteer at a Home
                or Rescue Volunteer. Please see more information below.
              </div>
            </div>
          </div>
          <div className="w-[25%] h-[300px]">
            <Image
              src="/images/btlogin.png"
              alt="Dog and Cat"
              width={1000}
              height={1000}
              className="w-[100%] h-[100%]"
            />
          </div>
        </div>
      </div>

      <div className="bg-[#F6F6F6] py-10">
        <div className="mx-[150px]">
          <div>
            <h1 className="text-center text-[40px] font-semibold">
              Volunteer information
            </h1>
            <div className="pt-3 flex">
              <div className="w-[35%] pl-[50px] pt-[10%]">
                <Image
                  src="/images/btlogin.png"
                  alt="Dog and Cat"
                  width={1000}
                  height={1000}
                  className="w-[70%] h-[50%] rounded-[100%] "
                />
              </div>
              <div className="w-[65%] p-10">
                <h2 className="text-[24px] font-semibold">The Long</h2>
                <p className="my-4">
                  Long is the person who helps the group take care of the babies
                  temporarily while they cant find their owners. These may be
                  healthy babies or need more special care. If you cannot adopt,
                  please open the door to give them a temporary home, help them
                  become healthier, more obedient, and enjoy the love from an
                  animal lover, while helping us reduce the load. workload.
                </p>
                <div>
                  <div className="bg-[#DDDDDD] rounded-[10px]">
                    <div className="py-5 px-2">
                      <div className="flex">
                        <Image
                          src="/images/footpet.png"
                          alt="Dog and Cat"
                          width={1000}
                          height={1000}
                          className="w-[20px] h-[100%] ml-5 pt-1"
                        />
                        <p className="ml-5 text-[#6F7073] text-[16px] font-semibold">
                          The temporary adopter (Long) is responsible for
                          providing shelter, food, water, necessary items and
                          love for the baby.
                        </p>
                      </div>

                      <div className="flex pt-3">
                        <Image
                          src="/images/footpet.png"
                          alt="Dog and Cat"
                          width={1000}
                          height={1000}
                          className="w-[20px] h-[100%] ml-5 pt-1"
                        />
                        <p className="ml-5 text-[#6F7073] text-[16px] font-semibold">
                          In case of necessity, the foster will monitor the
                          babys treatment process, ensure the required diet and
                          help train the baby. All medical expenses will be paid
                          by PawFund Adoption. Long can contribute to this cost
                          but is not required.
                        </p>
                      </div>

                      <div className="flex pt-3">
                        <Image
                          src="/images/footpet.png"
                          alt="Dog and Cat"
                          width={1000}
                          height={1000}
                          className="w-[20px] h-[100%] ml-5 pt-1"
                        />
                        <p className="ml-5 text-[#6F7073] text-[16px] font-semibold">
                          Long needs to immediately notify the person in charge
                          of the baby if anything happens: illness, strange
                          behavior, unusual behavior, etc.
                        </p>
                      </div>

                      <div className="flex pt-3">
                        <Image
                          src="/images/footpet.png"
                          alt="Dog and Cat"
                          width={1000}
                          height={1000}
                          className="w-[20px] h-[100%] ml-5 pt-1"
                        />
                        <p className="ml-5 text-[#6F7073] text-[16px] font-semibold">
                          Do not arbitrarily transfer animals in my temporary
                          care to someone elses care or adoption without
                          approval from the HPA team.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-center">
            <div className="bg-white w-[80%] px-5 py-3 flex justify-between">
              <div className="w-[80%]">
                <h1 className="text-center pb-2 text-[30px] font-semibold">
                  You want to participate ?
                </h1>
                <p className="px-5">
                  By volunteering for PawFund Adoption, you are contributing to
                  changing the fate of abandoned or abused dogs and cats.
                  Besides, you also have the opportunity to learn more...
                </p>
                <div className="flex justify-center gap-10">
                <button className="font-semibold duration-300 hover:text-white mt-6 rounded-md text-[15px] w-[30%] relative font-medium -top-1 -left-1 hover:top-0 hover:left-0 transition-all bg-[#FFEB55] hover:bg-[#2b74d4] py-2.5 px-5 uppercase text-black before:content-[''] before:absolute before:top-1 before:left-1 before:hover:top-0 before:hover:left-0 before:w-full before:border-2 before:border-[#FFEB55] before:-z-10 before:transition-all">
                    Create Pet
                  </button>
                  <button onClick={showModal} className="font-semibold duration-300 hover:text-white mt-6 rounded-md text-[15px] w-[30%] relative font-medium -top-1 -left-1 hover:top-0 hover:left-0 transition-all bg-[#FFEB55] hover:bg-[#2b74d4] py-2.5 px-5 uppercase text-black before:content-[''] before:absolute before:top-1 before:left-1 before:hover:top-0 before:hover:left-0 before:w-full before:border-2 before:border-[#FFEB55] before:-z-10 before:transition-all">
          Create Health Check
        </button>
        <Modal
          open={open}
          title="Create Health Check"
          onCancel={handleCancel}
          footer={[
            <Button key="back" onClick={handleCancel}>
              Return
            </Button>,
            <Button key="submit" type="primary" loading={loading} onClick={handleSubmit}>
              Submit
            </Button>,
          ]}
        >
          <div className="space-y-4">
            <div className="flex flex-col">
              <label className="font-semibold">Pet ID:</label>
              <Input value={petId} onChange={(e) => setPetId(e.target.value)} />
            </div>
            <div className="flex flex-col">
              <label className="font-semibold">Health Status:</label>
              <Select
                value={healthStatus}
                onChange={(value) => setHealthStatus(value as HealthStatus)}
                placeholder="Select Health Status"
              >
                {Object.values(HealthStatus).map((status) => (
                  <Select.Option key={status} value={status}>
                    {status}
                  </Select.Option>
                ))}
              </Select>
            </div>
            <div className="flex flex-col">
              <label className="font-semibold">Health Status Description:</label>
              <Input.TextArea
                value={healthStatusDescription}
                onChange={(e) => setHealthStatusDescription(e.target.value)}
              />
            </div>
            <div className="flex flex-col">
              <label className="font-semibold">Note:</label>
              <Input.TextArea value={note} onChange={(e) => setNote(e.target.value)} />
            </div>
            <div className="flex flex-col">
              <label className="font-semibold">Weight:</label>
              <Input
                type="number"
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
              />
            </div>
            <div className="flex flex-col">
              <label className="font-semibold">Temperature:</label>
              <Input
                type="number"
                value={temperature}
                onChange={(e) => setTemperature(Number(e.target.value))}
              />
            </div>
            <div className="flex flex-col">
              <label className="font-semibold">Checking Date:</label>
              <Input
                type="datetime-local"
                value={checkingDate}
                onChange={(e) => setCheckingDate(e.target.value)}
              />
            </div>
            <div className="flex flex-col">
              <label className="font-semibold">Checked By:</label>
              <Input value={checkingBy} onChange={(e) => setCheckingBy(e.target.value)} />
            </div>
            <div className="flex flex-col">
              <label className="font-semibold">Checking Type:</label>
              <Select
                value={checkingType}
                onChange={(value) => setCheckingType(value as CheckingType)}
                placeholder="Select Checking Type"
              >
                {Object.values(CheckingType).map((type) => (
                  <Select.Option key={type} value={type}>
                    {type}
                  </Select.Option>
                ))}
              </Select>
            </div>
          </div>
        </Modal>
                </div>
               
              </div>
              <div className="w-[20%]">
                <Image
                  src="/images/dogvolunteer.png"
                  alt="Dog and Cat"
                  width={1000}
                  height={1000}
                  className="w-[100%] h-[100%]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        
      </div>
    </div>
  );
};

export default Volunteer;
