
const initState = {
    data: {
        dataSended: '',
        dataRecieved: []
    }

}

const rootReducer = (state = initState, action) => {
    if (action.type === 'RMMBR_SENDED_DATA') {
        return {
            ...state,
            data: action.data
        }
    }
    return {
        ...state
    }
}

export default rootReducer