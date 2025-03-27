import { IsNumber, IsString, MinLength } from "class-validator";
import { IUser } from "../interface/IUser";
import { UUID } from "crypto";

export class UpdateUserDTO implements Pick<IUser, 'uuid'|'age'|'name'> {

    public readonly uuid: UUID;

    public readonly age: number|undefined;

    public readonly name: string|undefined;

    constructor(uuid: UUID, age?: number, name?: string) {
        this.validateProperties("age", age);
        this.validateProperties("name", name);
        this.uuid = uuid,
        this.age = age,
        this.name = name
    }

    validateProperties(field: "age"|"name", value: string|number|boolean) {

        if(typeof value === "string" && value.trim().length < 2) {
            throw new Error(`Field ${field} must have a length of 2 or more characters`);
        };

        if(field === "age" && typeof value == "number" && value < 1) {
            throw new Error(`Input a valid number for ${field} field`)
        }
    }
    
}