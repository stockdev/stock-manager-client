export default interface LoginResponse{
    jwtToken : string;
    id : number;
    fullName : string;
    phone : string;
    email : string;
    userRole : string;
}