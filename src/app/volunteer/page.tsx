"use client";
import Image from "next/image";
import React, {
  useEffect,
  useState,
  lazy,
  Suspense,
  useMemo,
  useCallback,
} from "react";

import { Button, Input, message, Modal, Select, Table } from "antd";
import { CheckingTypeVolunteer, HealthStatus } from "../../enum";
import { createHealthCheck } from "@/lib/features/pet/HealthCheckSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hook";

import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  id: string;
}

import axios from "axios";
import { fetchPets, removePet, deletePet } from "@/lib/features/pet/petSlice";
const AddPet = lazy(() => import("../addpet/page"));
const Volunteer = () => {
  const [presentUser, setPresentUser] = useState("");
  const { pets, status, error, sentToShelter } = useAppSelector(
    (state) => state.pets
  );
  const [healthCheckCreated, setHealthCheckCreated] = useState<{
    [key: string]: boolean;
  }>({});
  const [openAddPetModal, setOpenAddPetModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [petId, setPetId] = useState("");
  const [displayPetId, setDisplayPetId] = useState("********");
  const [healthStatus, setHealthStatus] = useState<HealthStatus | undefined>(
    undefined
  );
  const [healthStatusDescription, setHealthStatusDescription] = useState("");
  const [note, setNote] = useState("");
  const [name, setName] = useState("");
  const [checkingDate, setCheckingDate] = useState("");
  const [checkingBy, setCheckingBy] = useState("");
  const [checkingType, setCheckingType] = useState<CheckingTypeVolunteer>(
    CheckingTypeVolunteer.INITIAL
  );
  const [role, setRole] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [hasHydrated, setHasHydrated] = useState(false);

  const dispatch = useAppDispatch();

  const resetModalState = () => {
    setHealthStatus(undefined);
    setHealthStatusDescription("");
    setNote("");
    setCheckingDate("");
  };
 

  const showAddPetModal = () => {
    setOpenAddPetModal(true);
  };

  const handleCancelAddPet = () => {
    setOpenAddPetModal(false);
  };

  const handleOkAddPet = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOpenAddPetModal(false);
    }, 3000);
  };

  const showModal = () => {
    resetModalState();
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

  const handleDelete = (petId: string) => {
    dispatch(deletePet(petId));
  };

  const confirmDelete = useCallback(
    (petId) => {
      Modal.confirm({
        title: "Do you want to delete this pet",
        okText: "Confirm",
        okType: "danger",
        cancelText: "Cancel",
        onOk() {
          handleDelete(petId);
          message.success("Delete Pet success!");
        },
      });
    },
    [handleDelete]
  );

  const handleSubmit = async () => {
    const currentCheckingDate = new Date();
    const healthCheckData = {
      petId,
      healthStatus: healthStatus ? healthStatus.toString() : "",
      healthStatusDescription,
      note,
      checkingDate: currentCheckingDate,
      checkingBy,
      checkingType: checkingType ? checkingType.toString() : "",
    };
    console.log("Health Check Data:", healthCheckData);
    setLoading(true);
    try {
      await dispatch(createHealthCheck(healthCheckData)).unwrap();
      setHealthCheckCreated((prev) => ({ ...prev, [petId]: true }));
      setTimeout(() => {
        setLoading(false);
        handleOk();
      }, 3000);
    } catch (error) {
      console.error("Error from API:", error);
      if (error instanceof Error) {
        alert(`Error: ${error.message}`);
      } else {
        alert("Something went wrong");
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    setHasHydrated(true);
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("token");
      setToken(storedToken);

      if (storedToken) {
        const decodedToken = jwtDecode<DecodedToken>(storedToken);
        const userId = decodedToken.id;
        setPresentUser(userId);
        setCheckingBy(userId);

        const fetchUser = async () => {
          try {
            const response = await axios.get(
              `http://localhost:8000/users/${userId}`
            );
            setRole(response.data.role);
          } catch (error) {
            console.error("Error fetching user data:", error);
          }
        };

        fetchUser();
      }

      const storedHealthCheckCreated =
        localStorage.getItem("healthCheckCreated");
      if (storedHealthCheckCreated) {
        setHealthCheckCreated(JSON.parse(storedHealthCheckCreated));
      }
    }
  }, []);

  useEffect(() => {
    dispatch(fetchPets());
  }, [dispatch]);

  useEffect(() => {
    if (hasHydrated) {
      localStorage.setItem(
        "healthCheckCreated",
        JSON.stringify(healthCheckCreated)
      );
    }
  }, [healthCheckCreated, hasHydrated]);

  const handleCreateHealthCheckClick = useCallback(
    (pet) => {
      setPetId(pet._id);
      setDisplayPetId("********");
      setCheckingType(CheckingTypeVolunteer.INITIAL);
      showModal();
    },
    [showModal]
  );

  const handleSendToShelter = useCallback(
    async (petId) => {
      if (!healthCheckCreated[petId]) {
        message.warning("You must create health check first.");
        return;
      }
      try {
        const response = await axios.put(
          `http://localhost:8000/pet/update-delivery-status/${petId}`,
          {
            deliveryStatus: "PENDING",
          }
        );

        if (response.status === 200) {
          message.success("Pet has been sent to shelter !");
          dispatch(removePet(petId));
        } else {
          throw new Error("Failed to update pet status");
        }
      } catch (error) {
        console.error("Error updating pet status:", error);
        alert("Failed to send pet to shelter. Please try again.");
      }
    },
    [healthCheckCreated, dispatch]
  );

  const columns = useMemo(
    () => [
      {
        title: "Image",
        dataIndex: "image",
        key: "image",
        render: (text, record) => (
          <img
            src={record.image}
            alt={record.name}
            width={100}
            height={100}
            className="w-[100px] h-[100px] object-cover rounded-md"
          />
        ),
      },
      {
        title: "Pet Name",
        dataIndex: "name",
        key: "name",
      },
      {
        title: "Action",
        key: "action",
        render: (text, record) => (
          <div className="flex gap-5 items-center justify-center">
            {!healthCheckCreated[record._id] && (
              <Button
                onClick={() => handleCreateHealthCheckClick(record)}
                className="mt-2"
                type="primary"
              >
                Create Health Check
              </Button>
            )}
            <Button
              onClick={() => handleSendToShelter(record._id)}
              className="mt-2"
              style={{ backgroundColor: "green", color: "white" }}
            >
              Send to Shelter
            </Button>
            <Button
              onClick={() => confirmDelete(record._id)}
              className="mt-2"
              style={{ backgroundColor: "red", color: "white" }}
            >
              Delete
            </Button>
          </div>
        ),
      },
    ],
    [
      healthCheckCreated,
      handleCreateHealthCheckClick,
      handleSendToShelter,
      confirmDelete,
    ]
  );

  const dataSource = useMemo(
    () =>
      pets
        .filter(
          (pet) =>
            pet.deliveryStatus === "INPROCESS" &&
            !sentToShelter.includes(pet._id) &&
            pet.rescueBy === presentUser
        )
        .map((pet) => ({
          key: pet._id,
          image: pet.image,
          name: pet.name,
          _id: pet._id,
        })),
    [pets, sentToShelter, presentUser]
  );

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "failed") {
    return <div>Error: {error}</div>;
  }
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
              <a href="/" className="hover:text-blue-600 font-medium">
                HomePage
              </a>
              <span className="mx-2">&gt;</span>
              <a className="font-medium" href="/adopt">
                Adopt
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-[150px] pb-10">
        <div className="flex mt-10">
          <div className="w-[70%] h-auto">
            <div className="pl-10">
              <h1 className="text-[40px] uppercase font-bold">
                Introducing dog and cat rescue volunteers
              </h1>
              <hr className="w-[15%] bg-gray-400 h-[2px] my-4" />
              <div className="pt-7 text-lg leading-relaxed">
                PawFund Adoptions rescue operation can only be successful thanks
                to the combined efforts of the community and Volunteers. There
                are many ways for you to do your part to change the life of a
                dog or cat: become a Foster Caretaker, Volunteer at a Home or
                Rescue Volunteer. Please see more information below.
              </div>
            </div>
          </div>
          <div className="w-[30%] h-auto flex items-center justify-center">
            <Image
              src="/images/btlogin.png"
              alt="Dog and Cat"
              width={1000}
              height={1000}
              className="w-[70%] h-[60%] rounded-lg shadow-lg transition-transform duration-300 hover:scale-105"
            />
          </div>
        </div>
      </div>

      <div className="bg-[#F6F6F6] py-10">
        <div className="mx-[150px]">
          <div className="flex justify-center">
            <div className="bg-white w-[80%] px-5 py-3 flex justify-between">
              <div className="w-[80%]">
                <h1 className="text-center pb-2 text-[30px] font-semibold uppercase">
                  You want to participate ?
                </h1>
                <p className="px-5">
                  By volunteering for PawFund Adoption, you are contributing to
                  changing the fate of abandoned or abused dogs and cats.
                  Besides, you also have the opportunity to learn more...
                </p>
                <div className="flex justify-center gap-10">
                  {role === "VOLUNTEER" ? (
                    <>
                      <button
                        onClick={showAddPetModal}
                        className="font-semibold duration-300 hover:text-white mt-6 rounded-md text-[15px] w-[30%] relative font-medium -top-1 -left-1 hover:top-0 hover:left-0 transition-all bg-[#FFEB55] hover:bg-[#2b74d4] py-2.5 px-5 uppercase text-black before:content-[''] before:absolute before:top-1 before:left-1 before:hover:top-0 before:hover:left-0 before:w-full before:border-2 before:border-[#FFEB55] before:-z-10 before:transition-all"
                      >
                        Create Pet
                      </button>
                      <button
                        hidden
                        onClick={showModal}
                        className="font-semibold duration-300 hover:text-white mt-6 rounded-md text-[15px] w-[30%] relative font-medium -top-1 -left-1 hover:top-0 hover:left-0 transition-all bg-[#FFEB55] hover:bg-[#2b74d4] py-2.5 px-5 uppercase text-black before:content-[''] before:absolute before:top-1 before:left-1 before:hover:top-0 before:hover:left-0 before:w-full before:border-2 before:border-[#FFEB55] before:-z-10 before:transition-all"
                      >
                        Create Health Check
                      </button>
                    </>
                  ) : role === "CUSTOMER" ? (
                    <button
                      onClick={() =>
                        alert(
                          "You must have a volunteer account, please sign up now !"
                        )
                      }
                      className="font-semibold duration-300 hover:text-white mt-6 rounded-md text-[15px] w-[30%] relative font-medium -top-1 -left-1 hover:top-0 hover:left-0 transition-all bg-[#FFEB55] hover:bg-[#2b74d4] py-2.5 px-5 uppercase text-black before:content-[''] before:absolute before:top-1 before:left-1 before:hover:top-0 before:hover:left-0 before:w-full before:border-2 before:border-[#FFEB55] before:-z-10 before:transition-all"
                    >
                      Join with Us !
                    </button>
                  ) : role !== "VOLUNTEER" && role !== "CUSTOMER" ? (
                    <button
                      onClick={() =>
                        alert(
                          "You must Login with volunteer account to join with us !"
                        )
                      }
                      className="font-semibold duration-300 hover:text-white mt-6 rounded-md text-[15px] w-[30%] relative font-medium -top-1 -left-1 hover:top-0 hover:left-0 transition-all bg-[#FFEB55] hover:bg-[#2b74d4] py-2.5 px-5 uppercase text-black before:content-[''] before:absolute before:top-1 before:left-1 before:hover:top-0 before:hover:left-0 before:w-full before:border-2 before:border-[#FFEB55] before:-z-10 before:transition-all"
                    >
                      Join with Us !
                    </button>
                  ) : null}
                  <Modal
                    open={openAddPetModal}
                    title="Add a new pet"
                    onOk={handleOkAddPet}
                    onCancel={handleCancelAddPet}
                    footer={[
                      <Button key="cancel" onClick={handleCancelAddPet}>
                        Cancel
                      </Button>,
                    ]}
                  >
                    <Suspense fallback={<div>Loading...</div>}>
                      <AddPet />
                    </Suspense>
                  </Modal>
                  <Modal
                    open={open}
                    title="Create Health Check"
                    onCancel={handleCancel}
                    footer={[
                      <Button key="back" onClick={handleCancel}>
                        Return
                      </Button>,
                      <Button
                        key="submit"
                        type="primary"
                        loading={loading}
                        onClick={handleSubmit}
                      >
                        Submit
                      </Button>,
                    ]}
                  >
                    <div className="space-y-4">
                      {/* <div className="flex flex-col">
                        <label className="font-semibold">Pet ID:</label>
                        <Input
                          value={displayPetId}
                          onChange={(e) => setPetId(e.target.value)}
                          disabled
                        />
                      </div> */}
                      <div className="flex flex-col">
                        <label className="font-semibold">Health Status:</label>
                        <Select
                          value={healthStatus}
                          onChange={(value) =>
                            setHealthStatus(value as HealthStatus)
                          }
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
                        <label className="font-semibold">
                          Health Status Description:
                        </label>
                        <Input.TextArea
                          value={healthStatusDescription}
                          onChange={(e) =>
                            setHealthStatusDescription(e.target.value)
                          }
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="font-semibold">Note:</label>
                        <Input.TextArea
                          value={note}
                          onChange={(e) => setNote(e.target.value)}
                        />
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
          {role === "VOLUNTEER" && (
            <Table
              title={() => (
                <h1 className="text-center text-[30px] font-semibold">
                  PET CREATE LIST
                </h1>
              )}
              columns={columns}
              dataSource={dataSource}
              pagination={false}
              className="w-[1250px] ml-[200px] pt-10"
            />
          )}
        </div>
      </div>

      <div></div>
    </div>
  );
};

export default Volunteer;
