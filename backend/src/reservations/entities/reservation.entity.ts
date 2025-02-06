import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ReservationEntity {
        @PrimaryGeneratedColumn()
        id: number;
        @Column()
        userid: number;
        @Column()
        movieid: number;
        @Column({ type: 'timestamptz' })
        bookingSlot: Date;
}
