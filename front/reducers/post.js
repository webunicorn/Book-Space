import produce from 'immer';

export const initialState = {
    myWishs: [],
    imagePaths: [],
    addWishErrorReason: '',
    isAddingWish: false,
    wishAdded: false,
    hasMoreWish: false,
    hasMyWish: false,
    isLoadingWish: false,
    isRemovingWish: false,
};

export const ADD_WISH_REQUEST = 'ADD_WISH_REQUEST';
export const ADD_WISH_SUCCESS = 'ADD_WISH_SUCCESS';
export const ADD_WISH_FAILURE = 'ADD_WISH_FAILURE';

export const REMOVE_WISH_REQUEST = 'REMOVE_WISH_REQUEST';
export const REMOVE_WISH_SUCCESS = 'REMOVE_WISH_SUCCESS';
export const REMOVE_WISH_FAILURE = 'REMOVE_WISH_FAILURE';

export const LOAD_USER_WISH_REQUEST = 'LOAD_USER_WISH_REQUEST';
export const LOAD_USER_WISH_SUCCESS = 'LOAD_USER_WISH_SUCCESS';
export const LOAD_USER_WISH_FAILURE = 'LOAD_USER_WISH_FAILURE';

export const LOAD_WISH_INFO_REQUEST = 'LOAD_WISH_INFO_REQUEST';
export const LOAD_WISH_INFO_SUCCESS = 'LOAD_WISH_INFO_SUCCESS';
export const LOAD_WISH_INFO_FAILURE = 'LOAD_WISH_INFO_FAILURE';

export default (state = initialState, action) => {
    return produce(state, (draft) => {
        switch (action.type){
            case ADD_WISH_REQUEST: {
                draft.isAddingWish = true;
                draft.addWishErrorReason ='';
                draft.wishAdded = false;
                break;
            }

            case ADD_WISH_SUCCESS: {
                draft.isAddingWish = false;
                draft.myWishs.unshift(action.data);
                draft.wishAdded = true;
                break;
            }

            case ADD_WISH_FAILURE: {
                draft.isAddingWish = false;
                draft.addWishErrorReason = action.error;
                break;
            }

            case LOAD_USER_WISH_REQUEST: {
                draft.myWishs = [];
                break;
            }

            case LOAD_USER_WISH_SUCCESS: {
                action.data.forEach((d) => {
                    draft.myWishs.push(d);
                });
                break;    
            }

            case LOAD_USER_WISH_FAILURE: {
                break;    
            }

            case REMOVE_WISH_REQUEST: {
                draft.isRemovingWish = true;
                break;
            }

            case REMOVE_WISH_SUCCESS: {
                const index = draft.myWishs.findIndex(v => v.id === action.data);
                draft.myWishs.splice(index, 1);
                draft.isRemovingWish = false;
                break;
            }

            case REMOVE_WISH_FAILURE: {
                draft.isRemovingWish = false;
                break;
            }

            case LOAD_WISH_INFO_REQUEST: {
                draft.isLoadingWish = true;
                draft.myWishs = [];
                break;
            }

            case LOAD_WISH_INFO_SUCCESS: {
                action.data.forEach((d) => {
                    draft.myWishs.push(d);
                });
                draft.isLoadingWish = false;
                break;    
            }

            case LOAD_WISH_INFO_FAILURE: {
                draft.isLoadingWish = false;
                break;    
            }

            default: {
                break;
            }
        }
    });
};