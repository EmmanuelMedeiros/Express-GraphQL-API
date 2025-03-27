import { UUID } from "crypto";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn, TableForeignKey } from "typeorm";
import { User } from "../../user/entity/user.entity";

@Entity('user_friendship')
export class UserFriends {

    @ManyToOne(() => User, user => user.uuid)
    @JoinColumn({name: 'userAUUID'})
    @PrimaryColumn()
    public readonly userAUUID: UUID;

    @ManyToOne(() => User, user => user.uuid)
    @JoinColumn({name: 'userBUUID'})
    @PrimaryColumn()
    public readonly userBUUID: UUID;

    @Column({name: 'created_at', type: 'timestamp'})
    public readonly createdAt: string;

    constructor(userAUUID: UUID, userBUUID: UUID, createdAt: string) {
        this.userAUUID = userAUUID,
        this.userBUUID = userBUUID,
        this.createdAt = createdAt
    }

}