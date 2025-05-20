import { apiRequest } from './api';
import { PaginationParams, ReportParams, TicketResponse, TicketsResponse } from '../types';

export const createTicket = async (parkingId: string): Promise<TicketResponse> => {
  return apiRequest<TicketResponse>({
    method: 'POST',
    url: '/tickets',
    data: { parkingId },
  });
};

export const checkoutTicket = async (ticketId: string): Promise<TicketResponse> => {
  return apiRequest<TicketResponse>({
    method: 'PUT',
    url: '/tickets/checkout',
    data: { ticketId },
  });
};

export const getMyTickets = async (params: PaginationParams): Promise<TicketsResponse> => {
  return apiRequest<TicketsResponse>({
    method: 'GET',
    url: '/tickets/me',
    params,
  });
};

export const getAllTickets = async (params: PaginationParams): Promise<TicketsResponse> => {
  return apiRequest<TicketsResponse>({
    method: 'GET',
    url: '/tickets',
    params,
  });
};

export const getEntryReport = async (params: ReportParams): Promise<TicketsResponse> => {
  return apiRequest<TicketsResponse>({
    method: 'GET',
    url: '/tickets/report/entries',
    params,
  });
};

export const getExitReport = async (params: ReportParams): Promise<TicketsResponse> => {
  return apiRequest<TicketsResponse>({
    method: 'GET',
    url: '/tickets/report/exits',
    params,
  });
};