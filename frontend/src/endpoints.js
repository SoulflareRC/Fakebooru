const BASE_URL = process.env.REACT_APP_API_BASE_URL; 
const ACC_BASE_URL = BASE_URL;
export const ENDPOINTS = {
    POST(detail=""){
        return BASE_URL+"/api/post/"+detail;
    }, 
    TAG(detail=""){
        return BASE_URL+"/api/tag/"+detail
    },
    USERINFO(detail=""){
        return BASE_URL+"/api/userinfo/"+detail
    },
    COMMENT(detail=""){
        return BASE_URL+"/api/comment/"+detail
    },
    PROFILE(detail=""){
        return BASE_URL+"/api/profile/"+detail
    },
    VOTE(detail=""){
        return BASE_URL+"/api/vote/"+detail
    },
    RATING(detail=""){
        return BASE_URL+"/api/rating/"+detail
    }, 
    ACCOUNTS:{
        REGISTER:ACC_BASE_URL+'/register/',
        LOGIN:ACC_BASE_URL+'/login/', 
        LOGOUT:ACC_BASE_URL+"/logout/",
        EMAIL_VERIFY:ACC_BASE_URL+'/verify-email/',
        PASSWORD_RESET:ACC_BASE_URL+"/password/reset/", 
        PASSWORD_RESET_CONFIRM:ACC_BASE_URL+"/password/reset/confirm/"
    }

};

