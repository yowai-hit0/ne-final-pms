export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "USER" | "ADMIN";
  vehiclePlateNumber?: string;
}

export interface AuthResponse {
  status: string;
  message: string;
  data: {
    accessToken: string;
    user: User;
  } | null;
}

export interface ProfileResponse {
  status: string;
  message: string;
  data:   User;
}

export interface Parking {
  id: string;
  code: string;
  name: string;
  address: string;
  numberOfAvailableSpace: number;
  chargingFeePerHour: number;
  createdAt: string;
  updatedAt: string;
}

export interface ParkingsResponse {
  status: string;
  message: string;
  data: {
    parkings: Parking[];
    meta: {
      page: number;
      limit: number;
      total: number;
      lastPage: number;
    };
  };
}

export interface Ticket {
  id: string;
  userId: string;
  parkingId: string;
  entryTime: string;
  exitTime: string | null;
  chargedAmount: number;
  createdAt: string;
  updatedAt: string;
  parking?: Parking;
  user?: User;
}

export interface TicketsResponse {
  status: string;
  message: string;
  data: {
    tickets: Ticket[];
    meta: {
      page: number;
      limit: number;
      total: number;
      lastPage: number;
    };
  };
}

export interface TicketResponse {
  status: string;
  message: string;
  data: Ticket;
}

export interface ParkingResponse {
  status: string;
  message: string;
  data: Parking;
}

export interface ApiError {
  status: string;
  message: string;
  data: null;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface ReportParams extends PaginationParams {
  startDate: string;
  endDate: string;
}