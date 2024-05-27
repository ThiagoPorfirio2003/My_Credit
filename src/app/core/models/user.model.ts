import { enumProfile, enumSex } from "../enums/userProperties"
import { QRSimple } from "./QR.model";

export interface MyUser
{
    uid: string,
    email : string,
    profile : enumProfile,
    sex : enumSex,
    credit : number;
    QRs : Array<QRSimple>;
}

export interface MyUserAccessData
{
    email : string;
    password: string;
}