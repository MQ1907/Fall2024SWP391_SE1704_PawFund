import React, { useEffect, useState } from "react";
import { Layout, Table, Image } from "antd";
import { useAppDispatch, useAppSelector } from "../../lib/hook";
import { fetchHealthCheckByShelterStaff } from "../../lib/features/pet/HealthCheckSlice";
import { fetchPetById } from "@/lib/features/pet/petSlice";
import { RootState } from "../../lib/store";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import axios from "axios";

interface DecodedToken {
  id: string;
  exp: number;
  iat: number;
}

const { Header, Content } = Layout;

const HealcheckManagement = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [healthChecksWithPets, setHealthChecksWithPets] = useState([]);
  const healthChecks = useAppSelector(
    (state: RootState) => state.healthChecks.healthChecks
  );
  const status = useAppSelector(
    (state: RootState) => state.healthChecks.status
  );
  const error = useAppSelector((state: RootState) => state.healthChecks.error);
  const token = useAppSelector((state: RootState) => state.auth.token);
  const shelterStaffId = token ? (jwtDecode(token) as DecodedToken).id : null;

  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (!token) {
        router.push("/error");
        return;
      }

      try {
        const decodedToken = jwtDecode<DecodedToken>(token);
        const userId = decodedToken.id;

        const response = await axios.get(
          `http://localhost:8000/users/${userId}`
        );
        setRole(response.data.role);

        if (response.data.role !== "SHELTER_STAFF") {
          router.push("/errorpage");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        router.push("/error");
      }
    };

    fetchUserRole();
  }, [router, token]);

  useEffect(() => {
    if (shelterStaffId) {
      dispatch(fetchHealthCheckByShelterStaff(shelterStaffId));
    }
  }, [dispatch, shelterStaffId]);

  useEffect(() => {
    const fetchPetDetails = async () => {
      const healthCheckWithPets = await Promise.all(
        healthChecks.map(async (healthCheck: any) => {
          const petDetails = await dispatch(
            fetchPetById(healthCheck.petId)
          ).unwrap();
          return {
            ...healthCheck,
            petName: petDetails.name,
            petImage: petDetails.image,
          };
        })
      );
      setHealthChecksWithPets(healthCheckWithPets);
    };

    if (healthChecks.length) {
      fetchPetDetails();
    }
  }, [healthChecks, dispatch]);

  const columns = [
    {
      title: "Pet Image",
      dataIndex: "petImage",
      key: "petImage",
      render: (image: string) =>
        image ? <Image src={image} alt="Pet Image" width={50} /> : "No Image",
    },
    { title: "Pet Name", dataIndex: "petName", key: "petName" },
    { title: "Health Status", dataIndex: "healthStatus", key: "healthStatus" },
    {
      title: "Description",
      dataIndex: "healthStatusDescription",
      key: "healthStatusDescription",
    },
    { title: "Note", dataIndex: "note", key: "note" },
    { title: "Weight (kg)", dataIndex: "weight", key: "weight" },
    { title: "Temperature (°C)", dataIndex: "temperature", key: "temperature" },
    {
      title: "Checking Date",
      dataIndex: "checkingDate",
      key: "checkingDate",
      render: (date: string) => new Date(date).toLocaleString(),
    },
  ];

  if (status === "loading") return <p>Loading health checks...</p>;
  if (status === "failed")
    return <p>{error || "Failed to load health checks."}</p>;

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Layout>
        <Header style={{ background: "#fff", padding: 0 }} />
        <Content style={{ margin: "16px" }}>
          <h1>Health Check Management</h1>
          {healthChecksWithPets.length === 0 ? (
            <p>No health checks available.</p>
          ) : (
            <Table
              columns={columns}
              dataSource={healthChecksWithPets}
              rowKey={(check) => check._id}
              pagination={{ pageSize: 10 }}
            />
          )}
        </Content>
      </Layout>
    </Layout>
  );
};

export default HealcheckManagement;
