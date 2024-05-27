export interface QR
{
    code : string;
    value : number;
    howManyTimesCanBeUsed : number;
    howManyTimesAdmCanUse : number;
}

export interface QRSimple
{
    code : string;
    howManyTimesWasUsed : number;
}
