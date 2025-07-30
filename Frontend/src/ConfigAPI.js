import axios from "axios"

const sendMeetingText = async(inputText, userId) => {
    try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/meeting`,{
            meetingText: inputText
        },
        {
            withCredentials: true,
        }
    )
        console.log('Meeting text sent successfully: ', response.data);
        return response.data
    } catch (error) {
        console.log('Error in sendMeetingText: ', error)
    }
}

const registerUser = async(userData) => {
    try {
        console.log('Registering user with data: ', userData);
        

        const response = await axios.post(`${import.meta.env.VITE_API_URL}/user/signup` , {
            email: userData.email,
            password: userData.password,
            name: userData.name
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        console.log('User registered successfully: ', response.data);
        return response.data

    } catch (error) {
        console.log('Error in registerUser: ', error);
        return null;       
    }   
}

const loginUser = async(userData) => {
    try {
        
        const { email, password } = userData;
        console.log('Logging in user with email: ', email);
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/user/login`, {
            email,
            password
        }, {
            withCredentials: true,
        })
        console.log('User logged in successfully: ', response.data);
        return response

    } catch (error) {
        console.log('Error in loginUser: ', error);
        return null;        
    }
}

const logoutUser = async() => {
    try {
        
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/user/logout`, {}, {
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json'
            }
        })

        console.log('User logged out successfully: ', response.data);        
        return response;
    } catch (error) {
        console.log('Error in logging out: ', error);
        return null;
    }
}

const fetchUser = async() => {
    try {
        
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/user/fetch-user`,{
            withCredentials: true
        })

        console.log('User fetched successfully: ', response.data);
        return response;

    } catch (error) {
        console.log('Error in fetching user: ', error);
        return null;
    }
}

const fetchSummary = async() => {
    try {
        
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/summary/fetch-summary`, {
            withCredentials: true
        })

        console.log('Summary fetched successfully: ', response.data);
        return response;

    } catch (error) {
        console.log('Error in fetching summary from server: ',error);
        return null
        
    }
}

export {sendMeetingText, registerUser, loginUser, logoutUser, fetchUser, fetchSummary}