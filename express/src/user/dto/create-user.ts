import { IsNumber, IsString, MinLength } from "class-validator";
import { IUser } from "../interface/IUser";

export class CreateUserDTO implements Pick<IUser, 'age'|'name'> {

    public readonly age: number;

    public readonly name: string;

    constructor(age: number, name: string) {
        this.validateProperties("age", age);
        this.validateProperties("name", name)
        this.age = age,
        this.name = name
    }

    validateProperties(field: "age"|"name", value: string|number|boolean) {
        if(!value) {
            throw new Error(`You must set a value for the field ${field}`);
        };

        if(typeof value === "string" && value.trim().length < 2) {
            throw new Error(`Field ${field} must have a length of 2 or more characters`);
        };

        if(field === "age" && typeof value == "number" && value < 1) {
            throw new Error(`Input a valid number for ${field} field`)
        }
    }
    
}