import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity('auth')
export class AuthEntity {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    name: string;
    @Column()
    surname: string;
    @Column()
    email: string;
    @Column()
    password: string;
}
