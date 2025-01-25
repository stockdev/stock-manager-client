export default interface LoginResponse{
    jwtToken : string;
    firstName : string;
    lastName : string;
    phoneNumber : string;
    email : string;
    userRole : string;
}