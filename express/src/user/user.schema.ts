import { GraphQLError, GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLSchema, GraphQLString } from "graphql";

import { UserRoot } from "./user.root";
import { resolve } from "path";

const userRoot: UserRoot = new UserRoot();

const personType = new GraphQLObjectType({
    name: 'person',
    fields: () => ({
        name: {type: GraphQLString},
        age: {type: GraphQLString},
        uuid: {type: GraphQLString},
    }),

})

  const userType = new GraphQLObjectType({
    name: 'user',
    fields: () => ({
        name: {type: GraphQLString},
        age: {type: GraphQLString},
        uuid: {type: GraphQLString},
        friends: { type: new GraphQLList(personType),
            resolve: async (source, args, context) => {
                return await userRoot.findFriends(context.body)
            }
        }
    })
})


export const userSchema: GraphQLSchema = new GraphQLSchema({
    
    query: new GraphQLObjectType({
        name: 'query',
        fields: {

            usersList: {
                type: new GraphQLList(personType),
                resolve: async (source, args, context) => {
                    return await userRoot.findAll();
                }
            },

            userByUUID: {
                type: userType,
                args: {
                    uuid: {type: GraphQLString},
                },
                resolve: (source, args, context) => {
                    console.log(context.user)
                    return userRoot.findOne(args)
                }
            }

        }
    }),

    mutation: new GraphQLObjectType({
        name: 'mutation',
        fields: {

            updateUser: {
                type: userType,
                args: {
                    name: {type: GraphQLString},
                    age: {type: GraphQLInt},
                    uuid: {type: GraphQLString}
                },
                resolve: async (source, args, context) => {
                    return userRoot.updateUser(args, context.user)
                }
            },
            
            createUser: {
                type: userType,
                args: {
                    name: {type: GraphQLString},
                    age: {type: GraphQLInt}
                },
                resolve: async (source, args, context) => {
                    return userRoot.createUser(args, context.user)
                }
            },

            friendship: {
                type: GraphQLString,
                args: {
                    uuid_a: {type: GraphQLString},
                    uuid_b: {type: GraphQLString}
                },
                resolve: (source, args, context) => {
                    return userRoot.createFriendship(args)
                }
            }
        }
    }),
})
