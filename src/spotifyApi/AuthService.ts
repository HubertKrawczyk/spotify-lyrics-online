
const bearerKey = 'spotifyBearer';
const refreshKey = 'spotifyRefresh';

const clear = () => {
    localStorage.clear();
}

const getBearer = ()=> {
    return localStorage.getItem(bearerKey) ?? refreshToken();
}

const setBearer = (bearerToken: string) => {
    localStorage.setItem(bearerKey, bearerToken);
}

const getRefresh = ()=> {
    return localStorage.getItem(refreshKey);
}

const setRefresh = (refreshToken: string) => {
    localStorage.setItem(refreshKey, refreshToken);
}

const refreshToken = () => {
    getRefresh();
    return;
};

const isLoggedIn = () => !!getRefresh();

const authSerice = {
    getBearer,
    setBearer,
    setRefresh,
    clear,
    isLoggedIn,
};
export default authSerice