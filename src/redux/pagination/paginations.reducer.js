import Paginationtypes from './Paginations.types'

const initialState = {
  paginationMeta: {},
//   loading: false,
};

function paginationReducer(state = initialState, action={}) {
  switch (action.type) {
    case Paginationtypes.SET_PAGINATION_META:
      return {
        ...state,
        // loading: true,
        pagination: action.payload,
      };
    default:
      return state;
  }
}

export default paginationReducer;
