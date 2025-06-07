import { Column, PrimaryGeneratedColumn } from "typeorm";
import { v4 as uuidV4 } from 'uuid';

export class BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    
    @Column('boolean', { name: 'is_active' })
    isActive: boolean;
    @Column('timestamp', { name: 'created_at' })
    createdAt: Date;
    @Column('timestamp', { name: 'updated_at' })
    updatedAt: Date;
    @Column('timestamp', { name: 'deleted_at', nullable: true })
    deletedAt: Date | null;

    constructor() {
        this.id = uuidV4();
        this.isActive = true;
        this.createdAt = new Date();
        this.updatedAt = new Date();
        this.deletedAt = null;
    }
}