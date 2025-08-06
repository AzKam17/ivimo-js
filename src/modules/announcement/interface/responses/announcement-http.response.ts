import { t } from "elysia";
import { Announcement } from "../../infrastructure/entities";
import { AnnouncementStatus, AnnouncementTarget, AnnouncementType } from "@/core/enums/enums";
import { Double } from "typeorm";

export const AnnouncementResponseSchema = t.Object({
  title: t.String(),
  description: t.String(),
  status: t.String(),
  type: t.String(),
  target: t.String(),
  price: t.Number(),
  expiryDate: t.String(),
  companyId: t.String(),
  propertyId: t.String(),
  createdBy: t.String(),
});

export interface AnnouncementResponseProps {
  id: string;
  title: string;
  description: string;
  status: AnnouncementStatus;
  type: AnnouncementType;
  target: AnnouncementTarget;
  price: Double;
  expiryDate: Date;
  companyId: string;
  createdBy: string;
  propertyId: string;
  isActive: boolean;
}

export interface AnnouncementListResponseProps {
  item: AnnouncementResponse[];
  total: number;
  page: number;
  pageCount: number;
} 

export class AnnouncementResponse {
  id: string;
  constructor(props: Announcement) {
    const response: AnnouncementResponseProps = {
      id: props.id,
      title: props.title,
      description: props.description,
      status: props.status,
      type: props.type,
      target: props.target,
      price: props.price,
      expiryDate: props.expiryDate,
      companyId: props.companyId,
      createdBy: props.createdBy,
      propertyId: props.propertyId,
      isActive: props.isActive,
    };

    return response;
  }
}

export class AnnouncementListResponse {
  item: Announcement[];
  total: number;
  page: number;
  pageCount: number;


  constructor(props: AnnouncementListResponse){
    const reponse: AnnouncementListResponseProps = {
      total: props.total,
      item: props.item.map(x => new AnnouncementResponse(x)),
      page: props.page,
      pageCount: props.pageCount
    }
  }
  
}

// { item: Announcement[]; total: number; page: number; pageCount: number }