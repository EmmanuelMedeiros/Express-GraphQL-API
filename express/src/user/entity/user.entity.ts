import { Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import { IUser } from "../interface/IUser";
import { randomUUID, UUID } from "crypto";
import { UserFriends } from "../../common/entity/user-friends.entity";

@Entity('users')
export class User implements IUser{

    @PrimaryGeneratedColumn("uuid")
    public readonly uuid: UUID

    @Column()
    public readonly age: number;

    @Column({unique: true})
    public readonly name: string;

    @OneToMany(() => UserFriends, user => user.userAUUID)
    public readonly initiateFriendship: string[];

    @OneToMany(() => UserFriends, user => user.userBUUID)
    public readonly receiveFriendship: string[];

    constructor(uuid: UUID, age: number, name: string, initiateFriendship: string[], receiveFriendship: string[] ) {
        this.uuid = uuid,
        this.age = age,
        this.name = name,
        this.initiateFriendship = initiateFriendship,
        this.receiveFriendship = receiveFriendship
    }
}