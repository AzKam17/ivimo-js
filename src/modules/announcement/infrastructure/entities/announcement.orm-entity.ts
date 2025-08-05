import { AnnouncementStatus, AnnouncementTarget, AnnouncementType } from "@/core/enums/enums";
import { BaseEntity } from "@/core/infrastructure/entities/BaseEntity";
import { Column, Double, Entity } from "typeorm";

@Entity({ name: "announcement" })
export class Announcement extends BaseEntity {
    @Column("varchar", { name: 'title' })
    title: string;

    @Column("varchar", { name: 'description', nullable: true })
    description: string;

    @Column({ name: "status", type: "enum", enum: AnnouncementStatus, default: AnnouncementStatus.VALID })
    status: AnnouncementStatus;
        
    @Column({ name: "type",   type: "enum", enum: AnnouncementType,   default: AnnouncementType.NOVIP })
    type: AnnouncementType;

    @Column({ name: "target", type: "enum", enum: AnnouncementTarget, default: AnnouncementTarget.ALL })
    target: AnnouncementTarget;

    @Column("varchar", { name: 'price' })
    price: Double;

    @Column("timestamp", { name: 'expiry_date' })
    expiryDate: Date;

    @Column("varchar", { name: 'company_id' })
    companyId: string;

    @Column("varchar", { name: 'created_by' })
    createdBy: string;

    @Column("varchar", { name: 'property_id' })
    propertyId: string;

    static create(props: Partial<Announcement>): Announcement {
        const agent = new Announcement();
        Object.assign(agent, props);
        return agent;
    }
}