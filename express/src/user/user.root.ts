import { GraphQLError } from "graphql"
import { UserBusiness } from "./user.service"
import { CreateUserDTO } from "./dto/create-user"
import { UpdateUserDTO } from "./dto/update-user";
import { UUID } from "crypto";
import { User } from "./entity/user.entity";
import { UserFriends } from "../common/entity/user-friends.entity";

import * as moment from 'moment';


export class UserRoot {

    userBusiness = new UserBusiness()

    async createFriendship(args: {uuid_a: UUID, uuid_b: UUID}) {
        const newFriendship: UserFriends = new UserFriends(
            args.uuid_a,
            args.uuid_b,
            moment().format()
        );

        await this.userBusiness.createFriendship(newFriendship);
        return "Friendship created!"
    }

    async findFriends(body: () => {variables: any}) {

        const user = await this.findOne(body().variables);

        if(!user) {
            throw new GraphQLError("User not found for this UUID", {
                extensions: {
                    code: 'BAD REQUEST',
                    http: {status: 400}
                }
            })
        };

        const friendship = await this.userBusiness.findFriends(user.uuid);

        return friendship
    }

    async findOne(args: {uuid: UUID}) {
        const user = await this.userBusiness.findOne(args.uuid);

        if(!user) {
            throw new GraphQLError("User not found for this UUID", {
                extensions: {
                    code: 'BAD REQUEST',
                    http: {status: 400}
                }
            })
        };

        return user;

    }

    async findAll() {
        const users = await this.userBusiness.findAll();
        return users
    }

    async createUser(incomeUser: CreateUserDTO, userContext: {name: string, role: "admin"|"user"}) {

        let createUserDTO: CreateUserDTO;

        try {
            createUserDTO = new CreateUserDTO(incomeUser.age, incomeUser.name);
        }catch(err) {
            throw new GraphQLError(err.toString(), {
                extensions: {
                    code: 'BAD REQUEST',
                    http: {status: 400}
                }
            })
        };
        
        const serviceResponse = await this.userBusiness.create(createUserDTO);
        return serviceResponse;         
    };

    async updateUser(incomeUser: UpdateUserDTO, userContext: {name: string, role: "admin"|"user"}) {
        
        let updateUserDTO: UpdateUserDTO;

        try {
            updateUserDTO = new UpdateUserDTO(incomeUser.uuid, incomeUser.age, incomeUser.name);
        }catch(err) {
            throw new GraphQLError(err.toString(), {
                extensions: {
                    code: 'BAD REQUEST',
                    http: {status: 400}
                }
            })
        };
        
        return await this.userBusiness.update(updateUserDTO);
    }

}
