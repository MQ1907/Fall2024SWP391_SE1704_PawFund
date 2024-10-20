"use client";
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
  Snackbar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Tab,
  Tabs,
  Box,
  Typography,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "@/lib/hook";
import {
  fetchAdoptionRequests,
  fetchAdoptionRequestsByPetId,
  updateAdoptionRequestStatus,
} from "../../lib/features/adopt/adoptSlice";
import { fetchPetById } from "@/lib/features/pet/petSlice";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

const AdoptableManagement: React.FC<{ petId?: string }> = ({ petId }) => {
  const dispatch = useAppDispatch();
  const requestsStatus = useAppSelector((state) => state.adoption.status);
  const error = useAppSelector((state) => state.adoption.error);

  const [adoptionRequestsWithPetInfo, setAdoptionRequestsWithPetInfo] =
    useState<any[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentRequestId, setCurrentRequestId] = useState<string | null>(null);
  const [newStatus, setNewStatus] = useState<string | null>(null);
  const [comment, setComment] = useState<string>("");
  const [filter, setFilter] = useState<string>("ALL");
  const [petAdoptionSummary, setPetAdoptionSummary] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState(0);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  useEffect(() => {
    if (petId) {
      dispatch(fetchAdoptionRequestsByPetId(petId));
    } else {
      dispatch(fetchAdoptionRequests());
    }
  }, [dispatch, petId]);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const requests = await dispatch(fetchAdoptionRequests()).unwrap();

        const requestsWithPetInfo = await Promise.all(
          requests.map(async (request: any) => {
            try {
              const pet = await dispatch(fetchPetById(request.petId)).unwrap();
              return {
                ...request,
                petName: pet.name,
                petImage: pet.image,
              };
            } catch (error) {
              console.error(
                `Failed to fetch pet info for request ${request._id}:`,
                error
              );
            }
          })
        );

        const filteredRequests = requestsWithPetInfo.filter(Boolean);
        setAdoptionRequestsWithPetInfo(filteredRequests);

        // Create summary of adoption requests per pet
        const summary = filteredRequests.reduce((acc: any, request: any) => {
          if (!acc[request.petId]) {
            acc[request.petId] = {
              petId: request.petId,
              petName: request.petName,
              petImage: request.petImage,
              requestCount: 0,
            };
          }
          acc[request.petId].requestCount++;
          return acc;
        }, {});

        setPetAdoptionSummary(Object.values(summary));
      } catch (error) {
        setSnackbarMessage(
          "Failed to fetch adoption requests or pet information."
        );
        setSnackbarOpen(true);
      }
    };

    fetchRequests();
  }, [dispatch]);

  const showModal = (requestId: string, status: string) => {
    setCurrentRequestId(requestId);
    setNewStatus(status);
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    try {
      if (newStatus === "REJECTED" || newStatus === "APPROVED") {
        await dispatch(
          updateAdoptionRequestStatus({
            requestId: currentRequestId!,
            status: newStatus,
            comment,
          })
        ).unwrap();
        setAdoptionRequestsWithPetInfo((prevRequests) =>
          prevRequests.map((request) =>
            request._id === currentRequestId
              ? { ...request, status: newStatus, comment }
              : request
          )
        );
        setSnackbarMessage(`Adoption request ${newStatus.toLowerCase()}.`);
        setSnackbarOpen(true);

        // Update filter and active tab
        setFilter(newStatus);
        setActiveTab(1);
      }
    } catch (error) {
      setSnackbarMessage("Failed to update status.");
      setSnackbarOpen(true);
    }

    setIsModalVisible(false);
    setComment("");
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setComment("");
  };

  const columns = [
    { field: "petName", headerName: "Pet Name", width: 150 },
    {
      field: "petImage",
      headerName: "Image",
      width: 100,
      renderCell: (params: any) => (
        <img src={params.value} alt="Pet" style={{ width: 60, height: 60 }} />
      ),
    },
    {
      field: "requestDate",
      headerName: "Request Date",
      width: 150,
      renderCell: (params: any) => new Date(params.value).toLocaleDateString(),
    },
    { field: "comment", headerName: "Comment", width: 200 },
    {
      field: "adoptionDate",
      headerName: "Adoption Date",
      width: 150,
      renderCell: (params: any) =>
        params.value ? new Date(params.value).toLocaleDateString() : "",
    },
    { field: "status", headerName: "Status", width: 120 },
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params: any) => (
        <>
          {params.row.status === "PENDING" ? (
            <>
              <Button
                variant="contained"
                color="success"
                onClick={() => showModal(params.row._id, "APPROVED")}
                style={{ marginRight: 8 }}
              >
                Approve
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={() => showModal(params.row._id, "REJECTED")}
              >
                Reject
              </Button>
            </>
          ) : (
            <Button
              variant="contained"
              color="primary"
              onClick={() => showViewModal(params.row)}
            >
              View
            </Button>
          )}
        </>
      ),
    },
  ];

  const petSummaryColumns = [
    { field: "petName", headerName: "Pet Name", width: 150 },
    {
      field: "petImage",
      headerName: "Image",
      width: 100,
      renderCell: (params: any) => (
        <img src={params.value} alt="Pet" style={{ width: 60, height: 60 }} />
      ),
    },
    { field: "requestCount", headerName: "Number of Requests", width: 200 },
  ];

  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);

  const showViewModal = (record: any) => {
    setSelectedRequest(record);
    setViewModalVisible(true);
  };

  const getFilteredRequests = (status: string | null) => {
    if (status === null) {
      return adoptionRequestsWithPetInfo; // Return all requests
    }
    return adoptionRequestsWithPetInfo.filter(
      (request) => request.status === status
    );
  };

  return (
    <div style={{ marginTop: 148 }}>
      {requestsStatus === "loading" && <CircularProgress />}
      {requestsStatus === "failed" && (
        <Alert severity="error">Error: {error}</Alert>
      )}
      {requestsStatus === "succeeded" && (
        <Box sx={{ width: "100%" }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
           
              value={activeTab}
              onChange={(_, newValue) => setActiveTab(newValue)}
            >
              <Tab  className="text-black" label="Pet Adoption Summary" />
              <Tab className="text-yellow-500" label="Pending Requests" />
              <Tab className="text-green-500" label="Approved Requests" />
              <Tab className="text-red-500" label="Rejected Requests" />
            </Tabs>
          </Box>
          <TabPanel value={activeTab} index={0}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    {petSummaryColumns.map((column) => (
                      <TableCell key={column.field}>
                        {column.headerName}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {petAdoptionSummary.map((row) => (
                    <TableRow key={row.petId}>
                      {petSummaryColumns.map((column) => (
                        <TableCell key={column.field}>
                          {column.renderCell
                            ? column.renderCell({ value: row[column.field] })
                            : row[column.field]}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>
          <TabPanel value={activeTab} index={1}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    {columns.map((column) => (
                      <TableCell key={column.field}>
                        {column.headerName}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {getFilteredRequests("PENDING").map((row) => (
                    <TableRow key={row._id}>
                      {columns.map((column) => (
                        <TableCell key={column.field}>
                          {column.renderCell
                            ? column.renderCell({
                                row,
                                value: row[column.field],
                              })
                            : row[column.field]}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>
          <TabPanel value={activeTab} index={2}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    {columns.map((column) => (
                      <TableCell key={column.field}>
                        {column.headerName}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {getFilteredRequests("APPROVED").map((row) => (
                    <TableRow key={row._id}>
                      {columns.map((column) => (
                        <TableCell key={column.field}>
                          {column.renderCell
                            ? column.renderCell({
                                row,
                                value: row[column.field],
                              })
                            : row[column.field]}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>
          <TabPanel value={activeTab} index={3}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    {columns.map((column) => (
                      <TableCell key={column.field}>
                        {column.headerName}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {getFilteredRequests("REJECTED").map((row) => (
                    <TableRow key={row._id}>
                      {columns.map((column) => (
                        <TableCell key={column.field}>
                          {column.renderCell
                            ? column.renderCell({
                                row,
                                value: row[column.field],
                              })
                            : row[column.field]}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>
        </Box>
      )}
      <Dialog open={isModalVisible} onClose={handleCancel}>
        <DialogTitle>Enter a comment</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="comment"
            label="Comment"
            type="text"
            fullWidth
            variant="standard"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>Cancel</Button>
          <Button onClick={handleOk}>
            {newStatus === "APPROVED" ? "Approve" : "Reject"}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={viewModalVisible}
        onClose={() => setViewModalVisible(false)}
      >
        <DialogTitle>Request Details</DialogTitle>
        <DialogContent>
          {selectedRequest && (
            <DialogContentText>
              <Typography>
                <strong>Pet Name:</strong> {selectedRequest.petName}
              </Typography>
              <Typography>
                <strong>Status:</strong> {selectedRequest.status}
              </Typography>
              <Typography>
                <strong>Request Date:</strong>{" "}
                {new Date(selectedRequest.requestDate).toLocaleDateString()}
              </Typography>
              <Typography>
                <strong>Comment:</strong> {selectedRequest.comment}
              </Typography>
              {selectedRequest.adoptionDate && (
                <Typography>
                  <strong>Adoption Date:</strong>{" "}
                  {new Date(selectedRequest.adoptionDate).toLocaleDateString()}
                </Typography>
              )}
            </DialogContentText>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewModalVisible(false)}>Close</Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </div>
  );
};

export default AdoptableManagement;
