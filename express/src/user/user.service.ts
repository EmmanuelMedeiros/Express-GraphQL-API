import { GraphQLError } from 'graphql';
import { pgDataSource } from '../app-data-source'
import { CreateUserDTO } from './dto/create-user'
import { User } from './entity/user.entity'
import { UpdateUserDTO } from './dto/update-user';
import { UUID } from 'crypto';
import { UserFriends } from '../common/entity/user-friends.entity';

const userRepository = pgDataSource.getRepository(User);
const friendshipRepository = pgDataSource.getRepository(UserFriends);

export class UserBusiness {

    async createFriendship(userFriends: UserFriends) {
        try {
            return await friendshipRepository.insert(userFriends);
        }catch(err) {
            throw new GraphQLError(err.toString(), {
                extensions: {
                    code: 'BAD REQUEST',
                    http: {status: 400}
                }
            })
        }
    }
    
    async findFriends(uuid: UUID): Promise<any> {
        try {

            const sql: string = `
                           select
                        	*
                        from
                        	user_friendship uf
                        where
                        	uf."userAUUID" = $1
                        	or uf."userBUUID" = $1

                        `;
            
            const friendship: UserFriends[] = await friendshipRepository.query(sql, [uuid])

            if(!friendship) {
                return null
            };

            const friends = friendship.map( async (element) => {
                if(element.userAUUID !== uuid) {
                    return await this.findOne(element.userAUUID);
                } else {
                    return await this.findOne(element.userBUUID);
                }
            });

            return friends

        }catch(err) {
            throw new GraphQLError(err.toString(), {
                extensions: {
                    code: 'BAD REQUEST',
                    http: {status: 400}
                }
            })
        }
    }

    async findAll(): Promise<User[]> {
        return await userRepository.find();
    }

    async findOne(uuid: UUID): Promise<User> {
        try {
            const foundUser: User =  await userRepository.findOne({
                where: {
                    uuid: uuid
                }
            });

            return foundUser
        }catch(err) {
            throw new GraphQLError(err.toString(), {
                extensions: {
                    code: 'BAD REQUEST',
                    http: {status: 400}
                }
            })
        }
    }

    async create(createUserDTO: CreateUserDTO): Promise<CreateUserDTO> {
        try {
            return await userRepository.save(createUserDTO);
        } catch(err) {
            throw new GraphQLError(err.toString(), {
                extensions: {
                    code: 'BAD REQUEST',
                    http: {status: 400}
                }
            })
        }
    }

    async update(updateUserDTO: UpdateUserDTO): Promise<User> {
        try {

            const existingUser: User = await this.findOne(updateUserDTO.uuid);

            if(!existingUser) {
                throw new GraphQLError("There is not an user with the provided UUID", {
                    extensions: {
                        code: 'BAD REQUEST',
                        http: {status: 400}
                    }
                })
            }

            return await userRepository.save(updateUserDTO);
        } catch(err) {
            throw new GraphQLError(err.toString(), {
                extensions: {
                    code: 'BAD REQUEST',
                    http: {status: 400}
                }
            })
        }
    }
}